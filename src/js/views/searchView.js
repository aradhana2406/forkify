class SearchView {
  _parentElement = document.querySelector('.search');
  _errorMessage = ' OOf! We got an error!';
  _message = ' ';
  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }
  #clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      //alert('pressed');
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
