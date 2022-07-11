import {GenerateWrapperFunction, WrapperFile} from "../wrapper";

export const svelteWrapperGenerator: GenerateWrapperFunction = async (analysisResult, prefix, importMap) => {
  const ret: WrapperFile = {code: [], exportCodeLine: '', declarationLine: ''}
  return ret
}