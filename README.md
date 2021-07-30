# Inventory data Staatliche Museen zu Berlin

The data was obtained through a [Freedom of Information request via FragDenStaat](https://fragdenstaat.de/anfrage/inventar-der-staatlichen-museen-zu-berlin/). As the provided files do not follow CSV specifications, data cleanup with the scripts in this repo is necessary.

## To Do

- [ ] fix departments (caused by wrong column order?)
- [ ] fix (as many as possible) broken items in [`broken.csv`](./processed/broken.csv)

## License

Code (`*.js`) is [MIT-licensed](./LICENSE), data (`*.csv`) is [CC-0](https://creativecommons.org/publicdomain/zero/1.0).
