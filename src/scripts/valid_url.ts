export default function isValidURL(url: string): boolean {
  const urlRegex = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-zA-Z0-9$_.+!*'(),;?&=-]|%[0-9a-fA-F]{2})+:)*([a-zA-Z0-9$_.+!*'(),;?&=-]|%[0-9a-fA-F]{2})+@)?" + // username:password@
      "((([a-zA-Z0-9-])+\\.)+[a-zA-Z]{2,}|localhost|" + // domain name and extension or localhost
      "((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))" + // OR IPv4 address
      "(\\:[0-9]+)?" + // port
      "(\\/[-a-zA-Z0-9$_.+!*'(),;:@&=]*)*" + // path
      "(\\?([a-zA-Z0-9$_.+!*'(),;:@&=-]|%[0-9a-fA-F]{2})*)?" + // query string
      "(\\#[-a-zA-Z0-9$_.+!*'(),;:@&=]*)?$" // fragment locator
  );
  return urlRegex.test(url);
}
