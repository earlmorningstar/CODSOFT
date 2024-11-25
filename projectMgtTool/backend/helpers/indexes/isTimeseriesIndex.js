module.exports = function isTimeseriesIndex(index) {
  return index && index.type === "timeseries";
};
