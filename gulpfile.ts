import {Gulpclass, Task, MergedTask, SequenceTask} from "gulpclass";

const gulp = require("gulp");
const del = require("del");
const mocha = require("gulp-mocha");
const shell = require("gulp-shell");
const istanbul = require("gulp-istanbul");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");

@Gulpclass()
export class GulpFile
{
    // -------------------------------------------------------------------------
    // Build and packaging
    // -------------------------------------------------------------------------
    /**
     * Cleans build folder.
     */
    @Task()
    clean(cb: Function)
    {
        return del(["./build/**"], cb);
    }

    /**
     * Runs typescript files compilation.
     */
    @Task()
    compile()
    {
        return gulp.src("package.json", { read: false })
            .pipe(shell(["tsc"]));
    }

    // -------------------------------------------------------------------------
    // Main Packaging and Publishing tasks
    // -------------------------------------------------------------------------

    /**
     * Publishes a package to npm from ./build/package directory.
     */
    @Task()
    packagePublish()
    {
        return gulp.src("package.json", { read: false })
            .pipe(shell([
                "cd ./build/package && npm publish"
            ]));
    }

    /**
     * Copies all sources to the package directory.
     */
    @MergedTask()
    packageCompile()
    {
        const tsProject = ts.createProject("tsconfig.json", { typescript: require("typescript") });
        const tsResult = gulp.src(["./src/**/*.ts", "./node_modules/@types/**/*.ts"])
            .pipe(sourcemaps.init())
            .pipe(tsProject());

        return [
            tsResult.dts.pipe(gulp.dest("./build/package")),
            tsResult.js
                .pipe(sourcemaps.write(".", { sourceRoot: "", includeContent: true }))
                .pipe(gulp.dest("./build/package"))
        ];
    }

    /**
     * Change the "private" state of the packaged package.json file to public.
     */
    @Task()
    packagePreparePackageFile()
    {
        return gulp.src("./package.json")
            .pipe(gulp.dest("./build/package"));
    }

    /**
     * Copies README.md into the package.
     */
    @Task()
    packageCopyReadme()
    {
        return gulp.src("./README.md")
            .pipe(gulp.dest("./build/package"));
    }

    /**
     * Creates a package that can be published to npm.
     */
    @SequenceTask()
    package()
    {
        return [
            "clean",
            "packageCompile",
            "packagePreparePackageFile",
            "packageCopyReadme"
        ];
    }

    /**
     * Creates a package and publishes it to npm.
     */
    @SequenceTask()
    publish()
    {
        return ["package", "packagePublish"];
    }

    // -------------------------------------------------------------------------
    // Run tests tasks
    // -------------------------------------------------------------------------

    @Task()
    coverage()
    {
        return gulp.src(['src/**/*.js'])
            .pipe(istanbul())
            .pipe(istanbul.hookRequire());
    }

    @Task()
    mocha()
    {
        return gulp.src ('build/test/**/*.js', {read: false})
            .pipe (mocha ({noDeprecation: true}))
            .pipe(istanbul.writeReports())
            .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
    }

    /**
     * Compiles the code and runs tests + makes coverage report.
     */
    @SequenceTask()
    tests()
    {
        return ["compile", "mocha"];
    }
}