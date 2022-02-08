import axios, { AxiosResponse } from "axios";
import { saveAs } from "file-saver";
// import uuid from 'uuid';

const getDefaultContentType = (responseType: string) => {
  const fallbackContentType = "text/plain;charset=utf-8";

  switch (responseType) {
    case "json":
      return "application/json";

    case "text":
      return "text/plain;charset=utf-8";

    case "arraybuffer":
    case "blob":
      return fallbackContentType;

    case "document":
    case "stream": // unsupported by axios on the browser. The Fetch API Supports it, though.
    default:
      throw new Error(`Unhandled responseType "${responseType}" provided.`);
  }
};

const getBlobFromResponse = (
  res: AxiosResponse<any, any>,
  responseType = "json"
) => {
  const contentType =
    res.headers["content-type"] || getDefaultContentType(responseType);

  switch (responseType) {
    case "blob":
      return res.data;

    case "json":
    case "text":
    case "arraybuffer":
      return new Blob([res.data], {
        type: contentType,
      });

    case "document":
    case "stream": // unsupported by axios on the browser. The Fetch API Supports it, though.
    default:
      throw new Error(`Unhandled responseType "${responseType}" provided.`);
  }
};

/**
 * Download a file obtained from the given request `opts`.
 * @param opts {Object} - an axios request config object.
 * @param opts.responseType {string} - Specify `responseType` to ensure the response is handled properly.
 * `'json'`, `'text'`, `'blob'`, `'arraybuffer'` are supported.
 * The appropriate `Content-Type` header will be included in the request.
 * Defaults to `'json'`.
 * @see https://www.npmjs.com/package/axios#request-config
 *
 * @returns {Promise<void>} a promise that resolve to `void` once the request is done.
 */
const downloader = async (opts: any = {}) => {
  if (opts.responseType && ["stream", "document"].includes(opts.responseType)) {
    throw new Error(
      `Unsupported responseType "${opts.responseType}" provided.`
    );
  }

  return axios(opts).then((response) => {
    // Make a Blob from the response
    const blob = getBlobFromResponse(response, opts.responseType);

    // Try to determine the filename from the `content-disposition` header,
    //  fallback to a UUID if it fails.
    let filename = null;
    const disposition = response.headers["content-disposition"];
    if (disposition) {
      try {
        const filenameFromContentDisposition = disposition
          .split(";")
          .map((part) => part.trim())
          // Matching the modern format`filename="MyFile.txt"`,
          //  but not the derelict syntax `filename*=utf-8''MyFile.txt`
          .find((part) => /filename=".*"/i.test(part));
        // @ts-ignore
        filename = /filename="(.*)"/i.exec(filenameFromContentDisposition)[1];
      } catch (err) {
        // @ts-ignore
        filename = uuid();
        console.warn(
          "failed to parse filename, will fallback to an UUID",
          disposition
        );
      }
    }

    // Let the user download the file.
    saveAs(blob, filename);
  });
};
export default downloader;
