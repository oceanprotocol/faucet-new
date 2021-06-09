window.addEventListener('load', async () => {
  setupWaves()

  function setupWaves() {
    const svg = d3.select('#waves'),
      width = window.innerWidth,
      height = +svg.attr('height'),
      x = d3.scaleLinear().range([0, width])
    angles = d3.range(0, 4 * Math.PI, Math.PI / 20)

    const path = svg
      .append('g')
      .attr('transform', `translate(${-width / 24}, ${height / 1.8})`)
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .selectAll('path')
      .data(['#5E60CE', '#48BFE3', '#56CFE1', '#72EFDD'])
      .enter()
      .append('path')
      .attr('stroke', (d) => {
        return d
      })
      .style('mix-blend-mode', 'darken')
      .datum((d, i) => {
        return d3
          .line()
          .curve(d3.curveBasisOpen)
          .x((angles) => {
            return x(angles / 4)
          })
          .y((angles) => {
            const t = d3.now() / 3000
            return (
              Math.cos(angles * 8 - (i * 2 * Math.PI) / 10 + t) *
              Math.pow((2 + Math.cos(angles - t)) / 2, 4) *
              15
            )
          })
      })

    d3.timer(() => {
      path.attr('d', (d) => {
        return d(angles)
      })
    })
  }
})
