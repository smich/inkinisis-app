// Core modules
import fs from 'fs';
import hbs from 'hbs';
import hbsUtils from 'hbs-utils';
import path from 'path';

const hbsutils = hbsUtils(hbs);
const VIEWS_PATH = 'views';
const VIEWS_PARTIAL_PATH = path.join(VIEWS_PATH, 'partials');

// Define all micro-app names
// @todo: Move this to settings
const APP_NAMES = [
  'core',
  'settings',
  'trips',
];

/**
 * Register handlebars helper functions
 */
function registerHBSHelpers() {
  hbs.registerHelper('json', (context) => {
    JSON.stringify(context);
  });
  hbs.registerHelper('if_eq', function ifEq(a, b, opts) {
    return (a === b) ? opts.fn(this) : opts.inverse(this);
  });
  hbs.registerHelper('if_not', function ifNot(a, opts) {
    return !a ? opts.fn(this) : opts.inverse(this);
  });
  hbs.registerHelper('if_not_eq', function ifNotEq(a, b, opts) {
    return (a !== b) ? opts.fn(this) : opts.inverse(this);
  });
  hbs.registerHelper('if_mod_eq_zero', function ifModEqZero(a, b, opts) {
    return (a % b === 0) ? opts.fn(this) : opts.inverse(this);
  });
  hbs.registerHelper('apply_div', (a, b) => {
    parseFloat(parseInt(a, 10) / parseInt(b, 10));
  });
}

/**
 * Register the views path of all micro-apps
 *
 * By convention the path is the following:
 * /<micro-app-name>/views
 */
function registerViews(app) {
  const appNames = APP_NAMES;
  const viewsPath = [
    // The main views path
    VIEWS_PATH,
  ];

  appNames.forEach((appName) => {
    viewsPath.push(path.join(appName, 'views'));
  });

  app.set('views', viewsPath);
  app.set('view engine', 'hbs');
}

/**
 * Register the views partials path of all micro-apps
 *
 * By convention the path is the following:
 * /<micro-app-name>/views/partials
 */
function registerViewsPartials() {
  const appNames = APP_NAMES;

  // Register the main partials path
  hbsutils.registerPartials(VIEWS_PARTIAL_PATH);
  hbsutils.registerWatchedPartials(VIEWS_PARTIAL_PATH);

  // Register the partials path for each micro-app, if a partials dir exists
  appNames.forEach((appName) => {
    const partialsPath = path.join(appName, 'views', 'partials');
    if (fs.existsSync(partialsPath)) {
      hbsutils.registerPartials(partialsPath);
      hbsutils.registerWatchedPartials(partialsPath);
    }
  });
}

/**
 * Configure views and view engine using handlebars
 *
 * @param app
 */
function setupViews(app) {
  // Register the views
  registerViews(app);

  // Register and watch partials
  registerViewsPartials();

  // Register handlebars helper functions
  registerHBSHelpers();
}

export default setupViews;
