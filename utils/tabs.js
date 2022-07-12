module.exports = {
  getCorrectSibling: (element) => {
    return element[
      element.parentElement.lastChild === element
        ? "previousElementSibling"
        : "nextElementSibling"
    ];
  },
  removeClass :(selectorClass)=> {
     [...document.querySelectorAll(`.${selectorClass}`)].forEach((elm) => {
       elm.classList.remove(selectorClass);
     });
  }
};
