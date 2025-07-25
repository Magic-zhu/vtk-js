import test from 'tape';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import { VtkDataTypes } from 'vtk.js/Sources/Common/Core/DataArray/Constants';
import * as vtkMath from 'vtk.js/Sources/Common/Core/Math';

test('Test vtkDataArray instance', (t) => {
  t.ok(vtkDataArray, 'Make sure the class definition exists');
  const instance = vtkDataArray.newInstance({ size: 256 });
  t.ok(instance);
  t.end();
});

test('Test vtkDataArray getRange function with single-channel data.', (t) => {
  // create a data array with a single channel.
  const newArray = new Uint16Array(256 * 3);

  // fill the new array with the pattern 0,1,2,3,4,5, ..., 767.
  for (let i = 0; i < 256 * 3; ++i) {
    newArray[i] = i;
  }

  const da = vtkDataArray.newInstance({
    numberOfComponents: 1,
    values: newArray,
  });

  t.ok(da.getRange(0)[0] === 0, 'getRange minimum value should be 0');
  t.ok(da.getRange(0)[1] === 767, 'getRange maximum value should be 767');

  t.end();
});

test('Test vtkDataArray getRange function with NaN values.', (t) => {
  // a data array with a NaN value and max as first value
  const da = vtkDataArray.newInstance({
    numberOfComponents: 1,
    values: new Float64Array([4.0, 0, NaN, 3.0, 2.0, 1.0]),
  });

  t.equal(da.getRange(0)[0], 0.0, 'getRange minimum value should be 0');
  t.equal(da.getRange(0)[1], 4.0, 'getRange maximum value should be 4');

  // a data array with NaN as first value
  const da2 = vtkDataArray.newInstance({
    numberOfComponents: 1,
    values: new Float64Array([NaN, 0.0, 2.0, 3.0, 4.0, 1.0]),
  });

  t.equal(da2.getRange(0)[0], 0.0, 'getRange minimum value should be 0');
  t.equal(da2.getRange(0)[1], 4.0, 'getRange maximum value should be 4');

  // an empty data array
  const da3 = vtkDataArray.newInstance({
    numberOfComponents: 1,
    values: new Float64Array([]),
  });

  t.equal(
    da3.getRange(0)[0],
    Number.MAX_VALUE,
    'getRange minimum value should be MAX_VALUE'
  );
  t.equal(
    da3.getRange(0)[1],
    -Number.MAX_VALUE,
    'getRange maximum value should be -MAX_VALUE'
  );

  // a data array with all NaN values except one in the middle
  const da4 = vtkDataArray.newInstance({
    numberOfComponents: 1,
    values: new Float64Array([NaN, NaN, 2.0, NaN]),
  });

  t.equal(da4.getRange(0)[0], 2.0, 'getRange minimum value should be 2');
  t.equal(da4.getRange(0)[1], 2.0, 'getRange maximum value should be 2');

  // a data array with all NaN values except one at the end
  const da5 = vtkDataArray.newInstance({
    numberOfComponents: 1,
    values: new Float64Array([NaN, NaN, 2.0]),
  });

  t.equal(da5.getRange(0)[0], 2.0, 'getRange minimum value should be 2');
  t.equal(da5.getRange(0)[1], 2.0, 'getRange maximum value should be 2');

  // a data array with all NaN values
  const da6 = vtkDataArray.newInstance({
    numberOfComponents: 1,
    values: new Float64Array([NaN, NaN, NaN]),
  });

  t.equal(
    da6.getRange(0)[0],
    Number.MAX_VALUE,
    'getRange minimum value should be MAX_VALUE'
  );
  t.equal(
    da6.getRange(0)[1],
    -Number.MAX_VALUE,
    'getRange maximum value should be -MAX_VALUE'
  );

  // a data array with multiple components
  const da7 = vtkDataArray.newInstance({
    numberOfComponents: 2,
    values: new Float64Array([NaN, 1.0, 2.0, 3.0, 5.0, NaN]),
  });

  t.equal(
    da7.getRange(0)[0],
    2.0,
    'component:0 getRange minimum value should be 2'
  );
  t.equal(
    da7.getRange(0)[1],
    5.0,
    'component:0 getRange maximum value should be 5'
  );
  t.equal(
    da7.getRange(1)[0],
    1.0,
    'component:1 getRange minimum value should be 1'
  );
  t.equal(
    da7.getRange(1)[1],
    3.0,
    'component:1 getRange maximum value should be 3'
  );

  t.end();
});

test('Test vtkDataArray getRanges function with single-channel data.', (t) => {
  // create a data array with a single channel.
  const newArray = new Uint16Array(256 * 3);

  // fill the new array with the pattern 0,1,2,3,4,5, ..., 767.
  for (let i = 0; i < 256 * 3; ++i) {
    newArray[i] = i;
  }

  const da = vtkDataArray.newInstance({
    numberOfComponents: 1,
    values: newArray,
  });

  t.ok(
    da.getRanges().length === 1,
    'getRanges should return an array of 1 vtkRange objects'
  );
  t.ok(
    da.getRanges()[0].min === 0,
    'the first component returned by getRanges minimum value should be 0'
  );
  t.ok(
    da.getRanges()[0].max === 767,
    'the first component returned by getRanges maximum value should be 767'
  );

  t.end();
});

test('Test vtkDataArray getTuple', (t) => {
  const da = vtkDataArray.newInstance({
    numberOfComponents: 3,
    values: new Uint8Array([0, 1, 2, 3, 4, 5]),
  });
  const da2 = vtkDataArray.newInstance({
    numberOfComponents: 3,
    values: new Uint8Array([0, 1, 2, 3, 4, 5]),
  });

  t.ok(vtkMath.areEquals(da.getTuple(0), [0, 1, 2]), 'get first tuple');
  t.ok(vtkMath.areEquals(da.getTuple(1), [3, 4, 5]), 'get 2nd tuple');
  t.ok(da.getTuple(0) !== da.getTuple(1), 'getTuple twice');
  t.ok(da.getTuple(0) !== da2.getTuple(0), 'getTuple twice');
  const tuple = [];
  t.equal(da.getTuple(0, tuple), tuple, 'getTuple with tupleToFill');
  t.equal(tuple.length, 3, 'getTuple length');
  const typedArray = new Uint8Array(3);
  t.equal(
    da.getTuple(0, typedArray),
    typedArray,
    'getTuple with typed tupleToFill'
  );
  t.ok(vtkMath.areEquals(typedArray, [0, 1, 2]), 'get typed first tuple');
  t.end();
});

test('Test vtkDataArray getRange function with multi-channel data.', (t) => {
  // create a data array with 3 channel data.
  const newArray = new Uint16Array(256 * 3);

  // fill the new array with the pattern 1,2,3, 1,2,3
  // such that each channel has 1,1,1  2,2,2  3,3,3 respectively.
  for (let i = 0; i < 256; ++i) {
    newArray[i * 3] = i;
    newArray[i * 3 + 1] = i * 2;
    newArray[i * 3 + 2] = i * 3;
  }

  const da = vtkDataArray.newInstance({
    numberOfComponents: 3,
    values: newArray,
  });

  t.ok(da.getRange(0)[0] === 0, 'component:0 minimum value should be 0');
  t.ok(da.getRange(0)[1] === 255, 'component:0 maximum value should be 255');
  t.ok(da.getRange(1)[0] === 0, 'component:1 minimum value should be 0');
  t.ok(da.getRange(1)[1] === 510, 'component:1 maximum value should be 510');
  t.ok(da.getRange(2)[0] === 0, 'component:2 minimum value should be 0');
  t.ok(da.getRange(2)[1] === 765, 'component:2 maximum value should be 765');

  // re-fill the array with the pattern 0,0,0, 1,1,1 2,2,2 as 3d vector values
  for (let i = 0; i < 256; ++i) {
    newArray[i * 3] = i;
    newArray[i * 3 + 1] = i;
    newArray[i * 3 + 2] = i;
  }

  const compareFloat = (a, b) => Math.abs(a - b) < Number.EPSILON;
  const vecRange = da.getRange(-1);
  t.ok(
    compareFloat(vecRange[0].toFixed(2), 0.0),
    'vector magnitude min value should be be 0.0'
  );
  t.ok(
    compareFloat(vecRange[1].toFixed(3), 441.673),
    'vector magnitude max value should be 441.673'
  );
  t.end();
});

test('Test vtkDataArray getRanges function with multi-channel data.', (t) => {
  // create a data array with 3 channel data.
  const numberOfPixels = 10;
  const numberOfComponents = 4;
  const newArray = new Uint16Array(numberOfPixels * numberOfComponents);

  // fill the new array with the pattern 1,2,3, 1,2,3
  // such that each channel has 1,1,1  2,2,2  3,3,3 respectively.
  for (let i = 0; i < numberOfPixels; ++i) {
    newArray[i * numberOfComponents] = i;
    newArray[i * numberOfComponents + 1] = i * 2;
    newArray[i * numberOfComponents + 2] = i * 3;
    newArray[i * numberOfComponents + 3] = i * 4;
  }

  const da = vtkDataArray.newInstance({
    numberOfComponents,
    values: newArray,
  });

  const ranges = da.getRanges();

  t.ok(
    ranges.length === numberOfComponents + 1,
    'getRanges should return an array of 5 vtkRange objects'
  );
  t.ok(ranges[0].min === 0, 'component:0 minimum value should be 0');
  t.ok(ranges[0].max === 9, 'component:0 maximum value should be 9');
  t.ok(ranges[1].min === 0, 'component:1 minimum value should be 0');
  t.ok(ranges[1].max === 18, 'component:1 maximum value should be 18');
  t.ok(ranges[2].min === 0, 'component:2 minimum value should be 0');
  t.ok(ranges[2].max === 27, 'component:2 maximum value should be 27 ');
  t.ok(
    ranges[2].min === 0,
    'component:-1 vector magnitude minimum should be 0'
  );
  t.ok(
    ranges[3].max === 36,
    'component:-1 vector magnitude maximum should be 36'
  );

  t.end();
});

test('Test vtkDataArray getRanges(false) (`computeRanges=false`) function with multi-channel data', (t) => {
  // create a data array with 3 channel data.
  const numberOfPixels = 10;
  const numberOfComponents = 4;
  const newArray = new Uint16Array(numberOfPixels * numberOfComponents);

  // fill the new array with the pattern 1,2,3, 1,2,3
  // such that each channel has 1,1,1  2,2,2  3,3,3 respectively.
  for (let i = 0; i < numberOfPixels; ++i) {
    newArray[i * numberOfComponents] = i;
    newArray[i * numberOfComponents + 1] = i * 2;
    newArray[i * numberOfComponents + 2] = i * 3;
    newArray[i * numberOfComponents + 3] = i * 4;
  }

  const da = vtkDataArray.newInstance({
    numberOfComponents,
    values: newArray,
  });

  // set `computeRanges` to false.  This will prevent the ranges from being
  // computed and will return only the ranges previously computer (if any).
  const ranges = da.getRanges(false);

  t.ok(ranges === undefined, `getRanges should return undefined`);

  // now fetch the range for component 0.
  da.getRange(0);

  // now fetch the ranges again with `computeRanges` set to false.
  const updatedRanges = da.getRanges(false);

  // `updatedRanges` should now be only the range for component 0. because if
  // was computed in `da.getRange(0)`
  t.ok(
    updatedRanges.length === numberOfComponents + 1,
    'getRanges should return an array of 5 vtkRange objects'
  );
  t.ok(updatedRanges[0].min === 0, 'component:0 minimum value should be 0');
  t.ok(updatedRanges[0].max === 9, 'component:0 maximum value should be 9');
  t.ok(updatedRanges[1] === null, 'component:1 should be null');
  t.ok(updatedRanges[2] === null, 'component:2 should be null');
  t.ok(updatedRanges[3] === null, 'component:3 should be null');
  t.ok(updatedRanges[4] === null, 'component:-1 should be null');

  t.end();
});

test('Test vtkDataArray insertNextTuple', (t) => {
  const dataArray = vtkDataArray.newInstance({
    dataType: VtkDataTypes.UNSIGNED_CHAR,
    empty: true,
    numberOfComponents: 3,
  });
  t.equal(dataArray.getData().length, 0, 'dataArray.getData() starts empty');

  let idx = dataArray.insertNextTuple([1, 2, 3]);

  t.equal(dataArray.getData().length, 3, 'dataArray after first insert');
  t.equal(idx, 0, 'idx after first insert');

  idx = dataArray.insertNextTuple([4, 5, 6]);

  t.equal(dataArray.getData().length, 6, 'dataArray after second insert');
  t.equal(idx, 1, 'idx after second insert');

  // numberOfComponents forces the length of the inserted tuple to be 3
  idx = dataArray.insertNextTuple([7, 8, 9, 10]);

  t.equal(dataArray.getData().length, 9, 'dataArray after long insert');
  t.equal(dataArray.getData()[8], 9, 'dataArray last value is 9');
  t.equal(idx, 2, 'idx after third insert');

  idx = dataArray.insertNextTuple([10]);

  t.equal(dataArray.getData().length, 12, 'dataArray after short insert');
  t.equal(dataArray.getData()[11], 0, 'dataArray has default value');
  t.equal(idx, 3, 'idx after fourth insert');

  t.end();
});

test('Test vtkDataArray getTuples and insertTuples', (t) => {
  const values = Uint8Array.from([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  ]);

  const dataArray = vtkDataArray.newInstance({
    dataType: VtkDataTypes.UNSIGNED_CHAR,
    values,
    numberOfComponents: 3,
  });

  t.deepEqual(
    dataArray.getTuples(),
    values,
    'getTuples without parameters returns the whole array'
  );

  t.deepEqual(
    dataArray.getTuples(1, 4),
    Uint8Array.from([3, 4, 5, 6, 7, 8, 9, 10, 11]),
    'check tuples between two indices'
  );

  t.deepEqual(
    dataArray.getTuples(-3, -1),
    Uint8Array.from([6, 7, 8, 9, 10, 11]),
    'check tuples between two negative indices'
  );

  t.equal(dataArray.getTuples(1, 0), null, 'invalid range returns null');

  t.deepEqual(
    dataArray.getTuples(1, 10),
    Uint8Array.from([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
    'to > numberOfTuples returns array until numberOfTuples'
  );

  const emptyDataArray = vtkDataArray.newInstance({
    dataType: VtkDataTypes.UNSIGNED_CHAR,
    empty: true,
    numberOfComponents: 3,
  });

  emptyDataArray.insertNextTuples(dataArray.getTuples());

  t.deepEqual(
    emptyDataArray.getTuples(),
    values,
    'to.insertTuples(from.getTuples()) copies all the values'
  );

  t.end();
});

test('Test vtkDataArray findTuple', (t) => {
  const values = Uint8Array.from([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  ]);

  const dataArray = vtkDataArray.newInstance({
    dataType: VtkDataTypes.UNSIGNED_CHAR,
    values,
    numberOfComponents: 3,
  });

  t.equal(dataArray.findTuple([9, 10, 11]), 3);
  t.equal(dataArray.findTuple([3, 4, 4], 1), 1);
  t.equal(dataArray.findTuple(Float32Array.from([12, 13, 14])), 4);
  t.end();
});

test('Test vtkDataArray allocate function', (t) => {
  // create an empty data array with 3 channel data.
  const da = vtkDataArray.newInstance({
    numberOfComponents: 3,
    empty: true,
  });

  t.equal(da.getNumberOfTuples(), 0, 'empty');

  da.allocate(2);
  let oldData = da.getData();

  t.equal(
    da.getNumberOfTuples(),
    0,
    'allocate does not change number of tuples'
  );

  da.insertNextTuple([1, 2, 3]);
  da.insertNextTuple([1, 2, 3]);

  t.equal(da.getNumberOfTuples(), 2, 'inserted 2 tuples');
  t.equal(da.getData().buffer, oldData.buffer, 'no array allocation on insert');

  da.allocate(2);

  t.equal(
    da.getNumberOfTuples(),
    2,
    'allocate does not change number of tuples'
  );
  t.notEqual(
    da.getData().buffer,
    oldData.buffer,
    'reallocate array on allocate'
  );
  oldData = da.getData();

  da.insertNextTuple([1, 2, 3]);
  da.insertNextTuple([1, 2, 3]);

  t.ok(da.getNumberOfTuples() === 4, '2 more tuples');
  t.equal(da.getData().buffer, oldData.buffer, 'no array allocation on insert');

  t.end();
});

test('Test vtkDataArray resize function', (t) => {
  // create an empty data array with 3 channel data.
  const da = vtkDataArray.newInstance({
    numberOfComponents: 3,
    empty: true,
  });

  t.ok(da.getNumberOfTuples() === 0, 'empty');

  da.resize(2);

  t.ok(da.getNumberOfTuples() === 2, 'resize does change the number of tuples');

  da.insertNextTuple([1, 2, 3]);
  da.insertNextTuple([1, 2, 3]);

  t.ok(da.getNumberOfTuples() === 4, 'inserted 2 tuples');

  const oldData = da.getData();
  da.resize(2);

  t.ok(da.getNumberOfTuples() === 2, 'resize reduces the number of tuples');
  t.equal(da.getData().buffer, oldData.buffer, 'no array allocation on shrink');

  da.insertNextTuple([1, 2, 3]);
  da.insertNextTuple([1, 2, 3]);

  t.ok(da.getNumberOfTuples() === 4, '2 more tuples');
  t.equal(da.getData().buffer, oldData.buffer, 'no array allocation on shrink');

  t.end();
});
