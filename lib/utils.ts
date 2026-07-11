export function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function scrollProgress(element: HTMLElement, startOffset: number = 0, endOffset: number = 1): number {
  const rect = element.getBoundingClientRect();
  
  // Basic implementation of scroll progress tracking for a section
  const windowHeight = window.innerHeight;
  const scrollY = window.scrollY;
  const elementTop = element.offsetTop;
  const elementHeight = element.offsetHeight;
  
  const start = elementTop - windowHeight * (1 - startOffset);
  const end = elementTop + elementHeight - windowHeight * endOffset;
  
  const progress = (scrollY - start) / (end - start);
  return Math.max(0, Math.min(1, progress || 0));
}
