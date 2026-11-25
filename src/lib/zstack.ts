// One stacking counter for every desktop window, so whichever was touched last sits on top.
let top = 30;
export const nextZ = () => ++top;
