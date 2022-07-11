import esbuild from 'esbuild'
import path from "path";

export const nativeEventsPlugin: esbuild.Plugin = {
  name: 'ucp-native-events-plugin',
  setup(build) {
    build.onResolve({filter: /nativeEvents/}, async (args) => {
      return {path: path.join(process.cwd(), 'nativeEvents.ts')}
    })
    build.onLoad({filter: /nativeEvents/}, async (args) => {
      const code = `export default (element)=>{
  const events = ["click", "contextmenu", "dblclick", "mousedown", "mouseenter", "mouseleave", "mousemove",
        "mouseover", "mouseout", "mouseup", "keydown", "keypress", "keyup", "blur", "change", "focus", "focusin",
        "focusout", "input", "invalid", "reset", "search", "select", "submit", "drag", "dragend", "dragenter",
        "dragleave", "dragover", "dragstart", "drop", "copy", "cut", "paste", "mousewheel", "wheel", "touchcancel",
        "touchend", "touchmove", "touchstart"];

    const handler = event => {
        event.stopPropagation();
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
    };

    events.forEach(event=>element.shadowRoot.addEventListener(event, handler))
}`
      return {
        loader: "js",
        contents: code
      }
    })
  },
}
