import { getContentByRoute } from "@greenwood/cli/src/data/queries.js";
import styles from "./blog-posts-list.module.css";

export default class BlogPostsList extends HTMLElement {
  async connectedCallback() {
    const posts = (await getContentByRoute("/blog"))
      .filter((page) => page.data.published)
      // we sort in reverse chronologic order, e.g. last in, first out (LIFO)
      .sort((a, b) =>
        new Date(a.data.published).getTime() > new Date(b.data.published).getTime() ? -1 : 1,
      );

    this.innerHTML = `
      <ul class="${styles.postsList}">
        ${posts
          .map((post) => {
            const { title, route } = post;
            const { coverImage, abstract = "" } = post.data;
            const coverBackground = coverImage ? coverImage : "/assets/greenwood-logo-leaf.svg";
            const coverBackgroundPadding =
              coverImage && coverImage !== "/assets/greenwood-logo-g.svg" ? "4px" : "14px";

            return `
              <li class="${styles.postsListItem}">
                <a class="${styles.postsListItemContentLink}" href="${route}">
                  <img
                    alt="${title}"
                    class="${styles.postsListItemCoverImage}"
                    height="80"
                    width="80"
                    src="${coverBackground}"
                    style="padding-left: ${coverBackgroundPadding}"
                  />

                  <div class="${styles.postsListItemContentContainer}">
                    <h2 class="${styles.postsListItemContentTitle}">${title}</h2>
                    <p class="${styles.postsListItemContentAbstract}">${abstract}</p>
                  </div>

                </a>
              </li>
            `;
          })
          .join("")}
      </ul>
    `;
  }
}

customElements.define("app-blog-posts-list", BlogPostsList);
