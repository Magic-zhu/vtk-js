import { Wrap, Filter } from './Constants';
import vtkOpenGLRenderWindow from '../RenderWindow';
import { Extent, Nullable } from '../../../types';
import { VtkDataTypes } from '../../../Common/Core/DataArray';
import { vtkViewNode } from '../../../Rendering/SceneGraph/ViewNode';
import { vtkObject, vtkRange } from '../../../interfaces';

/**
 * Initial values for creating a new instance of vtkOpenGLTexture.
 */
export interface ITextureInitialValues {
  _openGLRenderWindow?: Nullable<vtkOpenGLRenderWindow>;
  _forceInternalFormat?: boolean;
  context?: WebGLRenderingContext | WebGL2RenderingContext;
  handle?: number;
  sendParametersTime?: vtkObject;
  textureBuildTime?: vtkObject;
  numberOfDimensions?: number;
  target?: number;
  format?: number;
  openGLDataType?: number;
  components?: number;
  width?: number;
  height?: number;
  depth?: number;
  autoParameters?: boolean;
  wrapS?: Wrap;
  wrapT?: Wrap;
  wrapR?: Wrap;
  minificationFilter?: Filter;
  magnificationFilter?: Filter;
  minLOD?: number;
  maxLOD?: number;
  baseLevel?: number;
  maxLevel?: number;
  generateMipmap?: boolean;
  useHalfFloat?: boolean;
  oglNorm16Ext?: any;
  allocatedGPUMemoryInBytes?: number;
}

/**
 * Interface for OpenGL Texture.
 */
export interface vtkOpenGLTexture extends vtkViewNode {
  /**
   * Renders the texture within the given render window.
   * @param renWin The render window in which to render the texture.
   */
  render(renWin: vtkOpenGLRenderWindow): void;

  /**
   * Destroys the texture and frees up any resources it's using.
   */
  destroyTexture(): void;

  /**
   * Creates the texture in the OpenGL context.
   */
  createTexture(): void;

  /**
   * Gets the texture unit number that this texture is bound to.
   * @returns {number} The texture unit number.
   */
  getTextureUnit(): number;

  /**
   * Activates the texture, making it the current texture for subsequent OpenGL operations.
   */
  activate(): void;

  /**
   * Deactivates the texture, making it no longer the current texture for subsequent OpenGL operations.
   */
  deactivate(): void;

  /**
   * Releases the graphics resources used by the texture within the given render window.
   * @param renWin The render window whose resources should be released.
   */
  releaseGraphicsResources(renWin: vtkOpenGLRenderWindow): void;

  /**
   * Binds the texture to the current OpenGL context.
   */
  bind(): void;

  /**
   * Checks if the texture is currently bound to the OpenGL context.
   * @returns {boolean} True if the texture is bound, false otherwise.
   */
  isBound(): boolean;

  /**
   * Sends the texture parameters to the OpenGL context.
   */
  sendParameters(): void;

  /**
   * Gets the internal format for the texture based on the VTK data type and number of components.
   * @param vtktype The VTK data type.
   * @param numComps The number of components in the texture.
   * @returns The internal format.
   */
  getInternalFormat(vtktype: VtkDataTypes, numComps: number): any;

  /**
   * Gets the default internal format for the texture based on the VTK data type and number of components.
   * @param vtktype The VTK data type.
   * @param numComps The number of components in the texture.
   * @returns The default internal format.
   */
  getDefaultInternalFormat(vtktype: VtkDataTypes, numComps: number): any;

  /**
   * Sets the internal format for the texture.
   * @param iformat The internal format to set.
   */
  setInternalFormat(iformat: any): void;

  /**
   * Gets the format for the texture based on the VTK data type and number of components.
   * @param vtktype The VTK data type.
   * @param numComps The number of components in the texture.
   * @returns The format.
   */
  getFormat(vtktype: VtkDataTypes, numComps: number): any;

  /**
   * Gets the default format for the texture based on the VTK data type and number of components.
   * @param vtktype The VTK data type.
   * @param numComps The number of components in the texture.
   * @returns The default format.
   */
  getDefaultFormat(vtktype: VtkDataTypes, numComps: number): any;

  /**
   * Resets the texture format and type to their default values.
   */
  resetFormatAndType(): void;

  /**
   * Gets the default data type for the texture based on the VTK scalar type.
   * @param vtkScalarType The VTK scalar type.
   * @returns The default data type.
   */
  getDefaultDataType(vtkScalarType: VtkDataTypes): any;

  /**
   * Gets the OpenGL data type for the texture based on the VTK scalar type and whether to force an update.
   * @param vtkScalarType The VTK scalar type.
   * @param forceUpdate Whether to force the update of the data type.
   * @returns The OpenGL data type.
   */
  getOpenGLDataType(vtkScalarType: VtkDataTypes, forceUpdate: boolean): any;

  /**
   * Gets the shift and scale values for the texture.
   * @returns The shift and scale values.
   */
  getShiftAndScale(): any;

  /**
   * Gets the OpenGL filter mode for the texture.
   * @param emode The filter mode.
   * @returns The OpenGL filter mode.
   */
  getOpenGLFilterMode(emode: Filter): any;

  /**
   * Gets the OpenGL wrap mode for the texture.
   * @param vtktype The wrap type.
   * @returns The OpenGL wrap mode.
   */
  getOpenGLWrapMode(vtktype: Wrap): any;

  /**
   * Updates the data array to match the required data type for OpenGL.
   *
   * This function takes the input data and converts it to the appropriate
   * format required by the OpenGL texture, based on the specified data type.
   *
   * @param {string} dataType - The original data type of the input data.
   * @param {Array} data - The input data array that needs to be updated.
   * @param {boolean} [depth=false] - Indicates whether the data is a 3D array.
   * @returns {Array} The updated data array that matches the OpenGL data type.
   */
  updateArrayDataTypeForGL(
    dataType: VtkDataTypes,
    data: any,
    depth?: boolean
  ): void;

  /**
   * Creates a 2D texture from raw data.
   * @param width The width of the texture.
   * @param height The height of the texture.
   * @param numComps The number of components in the texture.
   * @param dataType The data type of the texture.
   * @param data The raw data for the texture.
   * @param flip Whether to flip the texture vertically. Defaults to false.
   * @returns {boolean} True if the texture was successfully created, false otherwise.
   */
  create2DFromRaw({
    width,
    height,
    numComps,
    dataType,
    data,
    flip,
  }: {
    width: number;
    height: number;
    numComps: number;
    dataType: VtkDataTypes;
    data: any;
    flip?: boolean;
  }): boolean;

  /**
   * Creates a cube texture from raw data.
   * @param width The width of each face of the cube texture.
   * @param height The height of each face of the cube texture.
   * @param numComps The number of components in the texture.
   * @param dataType The data type of the texture.
   * @param data The raw data for the texture.
   * @returns {boolean} True if the cube texture was successfully created, false otherwise.
   */
  createCubeFromRaw({
    width,
    height,
    numComps,
    dataType,
    data,
  }: {
    width: number;
    height: number;
    numComps: number;
    dataType: VtkDataTypes;
    data: any;
  }): boolean;

  /**
   * Creates a 2D texture from an image.
   * @param image The image to use for the texture.
   * @returns {boolean} True if the texture was successfully created, false otherwise.
   */
  create2DFromImage(image: HTMLImageElement): boolean;

  /**
   * Creates a 2D texture from an ImageBitmap.
   * @param imageBitmap  The ImageBitmap to use for the texture.
   *  @returns {boolean} True if the texture was successfully created, false otherwise.
   */
  create2DFromImageBitmap(imageBitmap: ImageBitmap): boolean;

  /**
   * Creates a 2D filterable texture from raw data, with a preference for size over accuracy if necessary.
   * @param width The width of the texture.
   * @param height The height of the texture.
   * @param numComps The number of components in the texture.
   * @param dataType The data type of the texture.
   * @param data The raw data for the texture.
   * @param [preferSizeOverAccuracy=false] Whether to prefer texture size over accuracy. Defaults to false.
   * @param [ranges] The precomputed ranges of the data (optional). Provided to prevent computation of the data ranges.
   * @returns {boolean} True if the texture was successfully created, false otherwise.
   */
  create2DFilterableFromRaw({
    width,
    height,
    numComps,
    dataType,
    data,
    preferSizeOverAccuracy,
    ranges,
  }: {
    width: number;
    height: number;
    numComps: number;
    dataType: VtkDataTypes;
    data: any;
    preferSizeOverAccuracy?: boolean;
    ranges?: vtkRange[];
  }): boolean;

  /**
   * Creates a 2D filterable texture from a data array, with a preference for size over accuracy if necessary.
   * @param width The width of the texture.
   * @param height The height of the texture.
   * @param dataArray The data array to use for the texture.
   * @param preferSizeOverAccuracy Whether to prefer texture size over accuracy.
   * @returns {boolean} True if the texture was successfully created, false otherwise.
   */
  create2DFilterableFromDataArray({
    width,
    height,
    dataArray,
    preferSizeOverAccuracy,
  }: {
    width: number;
    height: number;
    dataArray: any;
    preferSizeOverAccuracy?: boolean;
  }): boolean;

  /**
   * Creates a 3D texture from raw data.
   *
   * updatedExtents is currently incompatible with webgl1, since there's no extent scaling.
   *
   * @param width The width of the texture.
   * @param height The height of the texture.
   * @param depth The depth of the texture.
   * @param numComps The number of components in the texture.
   * @param dataType The data type of the texture.
   * @param data The raw data for the texture.
   * @param updatedExtents Only update the specified extents (default: [])
   * @returns {boolean} True if the texture was successfully created, false otherwise.
   */
  create3DFromRaw({
    width,
    height,
    depth,
    numComps,
    dataType,
    data,
    updatedExtents,
  }: {
    width: number;
    height: number;
    depth: number;
    numComps: number;
    dataType: VtkDataTypes;
    data: any;
    updatedExtents?: Extent[];
  }): boolean;

  /**
   * Creates a 3D filterable texture from raw data, with a preference for size over accuracy if necessary.
   *
   * updatedExtents is currently incompatible with webgl1, since there's no extent scaling.
   *
   * @param width The width of the texture.
   * @param height The height of the texture.
   * @param depth The depth of the texture.
   * @param numComps The number of components in the texture.
   * @param dataType The data type of the texture.
   * @param data The raw data for the texture.
   * @param preferSizeOverAccuracy Whether to prefer texture size over accuracy.
   * @param [ranges] The precomputed ranges of the data (optional). Provided to
   * @param updatedExtents Only update the specified extents (default: [])
   * prevent computation of the data ranges.
   * @returns {boolean} True if the texture was successfully created, false
   * otherwise.
   */
  create3DFilterableFromRaw({
    width,
    height,
    depth,
    numComps,
    dataType,
    data,
    preferSizeOverAccuracy,
    ranges,
    updatedExtents,
  }: {
    width: number;
    height: number;
    depth: number;
    numComps: number;
    dataType: VtkDataTypes;
    data: any;
    preferSizeOverAccuracy?: boolean;
    ranges?: vtkRange[];
    updatedExtents?: Extent[];
  }): boolean;

  /**
   * Creates a 3D filterable texture from a data array, with a preference for size over accuracy if necessary.
   *
   * updatedExtents is currently incompatible with webgl1, since there's no extent scaling.
   *
   * @param width The width of the texture.
   * @param height The height of the texture.
   * @param depth The depth of the texture.
   * @param dataArray The data array to use for the texture.
   * @param preferSizeOverAccuracy Whether to prefer texture size over accuracy.
   * @param updatedExtents Only update the specified extents (default: [])
   * @returns {boolean} True if the texture was successfully created, false otherwise.
   */
  create3DFilterableFromDataArray({
    width,
    height,
    depth,
    dataArray,
    preferSizeOverAccuracy,
  }: {
    width: number;
    height: number;
    depth: number;
    dataArray: any;
    preferSizeOverAccuracy?: boolean;
    updatedExtents?: Extent[];
  }): boolean;

  /**
   * Sets the OpenGL render window in which the texture will be used.
   * @param renWin The render window to set.
   */
  setOpenGLRenderWindow(renWin: any): void;

  /**
   * Gets the maximum texture size supported by the OpenGL context.
   * @param ctx The OpenGL context.
   * @returns {number} The maximum texture size.
   */
  getMaximumTextureSize(ctx: any): number;

  /**
   * Public API to disable half float usage.
   * Half float is automatically enabled when creating the texture,
   * but users may want to disable it in certain cases
   * (e.g., streaming data where the full range is not yet available).
   * @param useHalfFloat - whether to use half float
   */
  enableUseHalfFloat(useHalfFloat: boolean): void;
}

/**
 * Extends the publicAPI with the given model and initial values.
 * @param publicAPI The API to extend.
 * @param model The model to use.
 * @param initialValues The initial values to apply.
 */
export function extend(
  publicAPI: object,
  model: object,
  initialValues?: ITextureInitialValues
): void;

/**
 * Creates a new instance of vtkOpenGLTexture with the given initial values.
 * @param initialValues The initial values to use.
 * @returns The new instance.
 */
export function newInstance(
  initialValues?: ITextureInitialValues
): vtkOpenGLTexture;

/**
 * vtkOpenGLTexture static API.
 */
export declare const vtkOpenGLTexture: {
  newInstance: typeof newInstance;
  extend: typeof extend;
};

export default vtkOpenGLTexture;
