export default {
  btoa_utf8(value) {
    return btoa(
      String.fromCharCode(
        ...new TextEncoder('utf-8').encode(value)
      )
    );
  },
  atob_utf8(value) {
    const value_latin1 = atob(value);
    return new TextDecoder('utf-8').decode(
      Uint8Array.from(
        {
          length: value_latin1.length 
        },
        (element, index) => value_latin1.charCodeAt(index)
      )
    )
  }
}