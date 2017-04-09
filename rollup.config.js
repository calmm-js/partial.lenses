import babel   from "rollup-plugin-babel"
import replace from "rollup-plugin-replace"
import uglify  from "rollup-plugin-uglify"

export default {
  plugins: [].concat(
    process.env.NODE_ENV
    ? [replace({"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)})]
    : [],
    [ babel() ],
    process.env.NODE_ENV === "production"
    ? [ uglify() ]
    : [ ]
  )
}
