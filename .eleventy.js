const yaml = require("js-yaml");
const path = require("path");
const { default: eleventyImage, generateHTML } = require("@11ty/eleventy-img");

// Shared eleventy-img runner. Returns the metadata object so each shortcode
// can decide how to render it (<picture>, plain <img>, or a CSS url()).
async function optimize(src, widths, formats = ["avif", "webp", "auto"]) {
  return eleventyImage(path.join("src", src), {
    widths,
    formats,
    urlPath: "/static/img/optimized/",
    outputDir: "./_site/static/img/optimized/",
    // Content-hashed filenames, so the browser can cache these forever.
    filenameFormat: (id, s, width, format) =>
      `${path.basename(s, path.extname(s))}-${width}.${format}`,
  });
}

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Tailwind's compiled output lives in _tmp and is copied in at build time.
  eleventyConfig.addPassthroughCopy({
    "./_tmp/static/css/style.css": "./static/css/style.css",
  });
  eleventyConfig.addWatchTarget("./_tmp/static/css/style.css");

  // Responsive <picture>. Use for anything that is visible page content.
  eleventyConfig.addAsyncShortcode(
    "image",
    async (src, alt, sizes = "100vw", classes = "", loading = "lazy") => {
      if (alt === undefined) {
        throw new Error(`Missing \`alt\` on image shortcode for: ${src}`);
      }
      const metadata = await optimize(src, [320, 640, 960, 1280, 1920], [
        "avif",
        "webp",
        "jpeg",
      ]);
      return generateHTML(metadata, {
        alt,
        sizes,
        class: classes,
        loading,
        decoding: "async",
      });
    }
  );

  // Fixed-width variant for the small 128px avatars and the logo, where
  // generating 1920px wide versions would just upscale a tiny source.
  eleventyConfig.addAsyncShortcode(
    "imageFixed",
    async (src, alt, widths, classes = "", loading = "lazy") => {
      const list = String(widths)
        .split(",")
        .map((w) => parseInt(w, 10));
      const metadata = await optimize(src, list, ["avif", "webp", "png"]);
      return generateHTML(metadata, {
        alt,
        sizes: `${list[0]}px`,
        class: classes,
        loading,
        decoding: "async",
      });
    }
  );

  // Returns a bare URL for one optimized size, for use in inline
  // `background-image: url(...)` on the hero sections.
  eleventyConfig.addAsyncShortcode("imageUrl", async (src, width = 1920, format = "webp") => {
    const metadata = await optimize(src, [width], [format]);
    return metadata[format][0].url;
  });

  // Small optimized PNG used as the favicon.
  eleventyConfig.addAsyncShortcode("favicon", async (src, width = 64) => {
    const metadata = await optimize(src, [width], ["png"]);
    return metadata.png[0].url;
  });

  // Current year, for the footer copyright line.
  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
