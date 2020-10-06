/**
 * Makes an api call to backend for file Upload
 * @param  {string} method Request type for e.g. GET,POST
 * @param  {string} url   API (endpoint)
 * @param  {object} files  Image Object
 * @param  {object} data   form fields
 * @param  {string} imageName image name
 */
function upload(method, url, files, data, imageName) {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();

    const formData = new FormData();
    console.log('from upload js', files);

    formData.append(imageName, files);

    // deleting property of object
    // delete data.new_image;

    for (let item in data) {
      formData.append(item, data[item]);
    }
    xhr.onreadystatechange = () => {
      // logic behind xhr request

      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      }
    };
    xhr.open(method, url);
    // xhr.setRequestHeader('x-access-token', localStorage.getItem('token'));s
    xhr.send(formData);
  });
}
module.exports = {
  upload,
};
