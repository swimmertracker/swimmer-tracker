export const fetchPrefix = "/api";
export function get(url) {
  return fetch(fetchPrefix + url, {
    method: "GET",
  }).then((res) => res.json());
}

export function post(url, postData) {
  return fetch(fetchPrefix + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: postData,
  });
}

export function del(url) {
  return fetch(fetchPrefix + url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function put(url, putData) {
  return fetch(fetchPrefix + url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: putData,
  });
}
