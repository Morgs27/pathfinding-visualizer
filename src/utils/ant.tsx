const Ant = (colour: string) => {
  const svg = `<?xml version="1.0" encoding="iso-8859-1"?>
  <svg fill="${colour}" height="800px" width="800px" version="1.1" id="Layer_1"
      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512.004 512.004" xml:space="preserve">
  <g>
      <g>
          <path d="M435.202,273.071h-31.77l-40.636-24.38c-1.331-0.802-2.842-1.22-4.395-1.22H306.17c0.674-2.756,1.033-5.615,1.033-8.533
              c0-3.371-0.521-6.639-1.417-9.788l37.222-7.45c2.219-0.435,4.173-1.749,5.427-3.627l32.179-48.265l39.194-7.842
              c2.219-0.435,4.173-1.749,5.427-3.627l17.067-25.6c2.62-3.925,1.562-9.225-2.364-11.836c-3.934-2.628-9.225-1.553-11.836,2.364
              l-15.113,22.665l-39.194,7.842c-2.219,0.435-4.173,1.749-5.427,3.627l-32.179,48.265l-39.177,7.834
              c-2.142-2.389-4.565-4.582-7.245-6.554c15.471-8.636,25.967-25.156,25.967-44.1v-18.483c0-2.005-0.145-3.959-0.375-5.897
              c0.102-0.435,0.316-0.819,0.35-1.28c0.043-0.521,4.284-51.849,34.159-51.849c45.892,0,50.995-73.156,51.183-76.262
              c0.29-4.71-3.285-8.755-7.979-9.054c-4.693-0.324-8.764,3.277-9.054,7.987c-0.043,0.597-4.591,60.262-34.15,60.262
              c-27.622,0-40.448,23.868-46.336,43.264c-3.959-4.608-8.713-8.525-14.08-11.469c5.666-5.999,9.199-13.926,9.182-22.554
              c0.154-1.775,1.186-17.587-7.885-27.435c-4.454-4.847-10.573-7.407-17.681-7.407c-4.719,0-8.533,3.823-8.533,8.533
              s3.814,8.533,8.533,8.533c2.987,0,4.301,1.007,5.112,1.877c3.422,3.695,3.635,11.921,3.422,15.189
              c0,9.412-7.654,17.067-17.067,17.067h-17.067c-9.412,0-17.067-7.654-17.101-17.775c-0.247-3.081,0.256-10.999,3.439-14.464
              c0.811-0.879,2.125-1.894,5.129-1.894c4.719,0,8.533-3.823,8.533-8.533s-3.814-8.533-8.533-8.533
              c-7.108,0-13.227,2.56-17.681,7.407c-9.071,9.847-8.038,25.66-7.919,26.726c0,8.994,3.567,17.126,9.267,23.236
              c-5.385,2.944-10.155,6.869-14.131,11.494c-5.888-19.396-18.714-43.264-46.336-43.264c-29.457,0-34.108-59.674-34.15-60.271
              c-0.299-4.71-4.454-8.311-9.054-7.979c-4.702,0.299-8.269,4.352-7.979,9.054c0.188,3.106,5.291,76.262,51.183,76.262
              c29.747,0,34.116,51.337,34.159,51.857c0.034,0.452,0.247,0.836,0.35,1.271c-0.23,1.937-0.375,3.891-0.375,5.897v18.483
              c0,18.944,10.496,35.465,25.967,44.1c-2.679,1.971-5.103,4.164-7.245,6.554l-39.177-7.834l-32.179-48.265
              c-1.254-1.877-3.208-3.191-5.427-3.627l-39.194-7.842l-15.113-22.665c-2.611-3.917-7.91-4.992-11.836-2.364
              c-3.925,2.611-4.984,7.91-2.364,11.836l17.067,25.6c1.254,1.877,3.209,3.191,5.427,3.627l39.194,7.842l32.179,48.265
              c1.254,1.877,3.208,3.191,5.427,3.627l37.222,7.45c-0.896,3.149-1.417,6.417-1.417,9.788c0,2.918,0.358,5.777,1.033,8.533h-52.233
              c-1.553,0-3.063,0.418-4.395,1.22l-40.636,24.38h-31.77c-4.719,0-8.533,3.823-8.533,8.533s3.814,8.533,8.533,8.533h34.133
              c1.553,0,3.063-0.418,4.395-1.22l40.636-24.38h57.37c0.546,0,1.016-0.213,1.528-0.307c4.241,4.77,9.617,8.789,15.829,11.75
              c-5.427,6.042-8.823,13.943-8.823,22.69v3.26l-80.614,40.303c-2.364,1.186-4.036,3.379-4.548,5.965L111.61,473.664l-23.774,23.774
              c-3.337,3.337-3.337,8.73,0,12.066c1.664,1.664,3.849,2.5,6.033,2.5c2.185,0,4.369-0.836,6.033-2.5l25.6-25.6
              c1.195-1.195,1.997-2.705,2.33-4.361l24.789-123.904l69.248-34.628v3.26c0,8.491,3.226,16.171,8.38,22.153
              c-24.909,10.189-42.513,34.654-42.513,63.181v34.133c0,37.641,30.626,68.267,68.267,68.267c37.641,0,68.267-30.626,68.267-68.267
              v-34.133c0-28.527-17.604-52.992-42.513-63.181c5.154-5.982,8.38-13.662,8.38-22.153v-3.26l69.248,34.628l24.789,123.904
              c0.333,1.655,1.135,3.166,2.33,4.361l25.6,25.6c1.664,1.664,3.849,2.5,6.033,2.5c2.185,0,4.369-0.836,6.033-2.5
              c3.336-3.336,3.336-8.73,0-12.066l-23.774-23.774l-25.097-125.466c-0.512-2.586-2.185-4.779-4.548-5.965l-80.614-40.303v-3.26
              c0-8.747-3.396-16.649-8.823-22.69c6.212-2.961,11.588-6.98,15.829-11.75c0.512,0.094,0.981,0.307,1.527,0.307h57.37l40.636,24.38
              c1.331,0.802,2.842,1.22,4.395,1.22h34.133c4.719,0,8.533-3.823,8.533-8.533S439.921,273.071,435.202,273.071z"/>
      </g>
  </g>
  </svg>`;

  const img = document.createElement("img");
  img.src = "data:image/svg+xml;base64," + btoa(svg);
  return img;
};

export default Ant;