export function removeChildren(element) {
    while (element.firstChild) {
        element.firstChild.remove();
      }
}
