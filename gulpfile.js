const { src, dest, watch } = require('gulp');
const minifyJS = require('gulp-uglify');
const sourceMaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const order = require("gulp-order");

const bundleJS = () => {
    return src('./src/**/*.js')
        .pipe(order([
            'maps/combatMap.js',
            'maps/**/*.js',
            'screens/**/*.js',
            'entities/entity.js',
            'entities/monster/monster.js',
            'entities/tower/tower.js',
            'entities/tower/damageTower.js',
            'entities/**/*.js',
            'cards/spells/spell.js',
            'cards/**/*.js',
            'accessories/**/*.js',
            'misc/**/*.js',
            'ui/**/*.js',
            'src/game.js'
        ]))
        .pipe(sourceMaps.init())
        .pipe(minifyJS())
        .pipe(concat('game.min.js'))
        .pipe(sourceMaps.write())
        .pipe(dest('./'));
}

const devWatch = () => {
    watch('./src/**/*.js', bundleJS);
}

exports.bundleJS = bundleJS;
exports.devWatch = devWatch;
