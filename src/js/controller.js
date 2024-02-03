import 'core-js/actual';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import addRecipeView from './views/addRecipeView.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
//console.log(icons);
if (module.hot) {
  //alert('gf');
  module.hot.accept();
}
export const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //xconsole.log('called controlAddRecipe');
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage('recipe uploded successfully');
    bookmarksView.render(model.state.bookmarks);
    //change id to url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 2500);
  } catch (err) {
    console.log('added what/');
    addRecipeView.renderError(err.message);
  }
};
export const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    //console.log(id);
    if (!id) return;
    recipeView.renderSpinner();
    //loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;
    //console.log(recipe);
    recipeView.render(model.state.recipe);
    //controlServings();
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    //rendering recipe
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};
const controlPagination = function (goToPage) {
  console.log('page control' + goToPage);
  //render new search results
  console.log('pagination is' + goToPage);

  resultsView.render(model.getSearchResultsPage(goToPage));

  //render new pagination buttons
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlSearchResults = async () => {
  try {
    //1. get search results
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    //2. load search results
    await model.loadSearchResults(query);
    //3. render results

    //console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (err) {}
};
const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};
const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('welcome here mom');
};

init();
//controlSearchResults();
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//console.log('test');

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
