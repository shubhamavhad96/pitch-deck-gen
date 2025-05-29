// templates/deckTemplate.ts
export function buildHTML(slides: { title: string; content: string }[]) {
  return `
    <html>
      <head>
        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: white;
          }

          .slide {
            padding: 40px;
            page-break-after: always;
          }

          .content-box {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 30px;
          }

          h2 {
            font-size: 22px;
            margin-bottom: 12px;
            color: #222;
          }

          p {
            font-size: 16px;
            line-height: 1.6;
            color: #333;
          }

          .footer {
            margin-top: 40px;
            font-size: 12px;
            color: #999;
            text-align: center;
          }
        </style>
      </head>
      <body>
        ${slides
          .map(
            (slide, i) => `
              <div class="slide">
                <div class="content-box">
                  <h2>${slide.title}</h2>
                  <p>${slide.content}</p>
                  <div class="footer">© 2025 Shubham Avhad | Slide ${i + 1}</div>
                </div>
              </div>
            `
          )
          .join("")}
      </body>
    </html>
  `;
}
