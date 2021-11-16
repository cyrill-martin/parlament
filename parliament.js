// Set the language
let language = "de";

const drawParliament = async () => {
  // Load the data
  let dataset = await d3.json("N_council.json");
  const occupationalFields = await d3.json("occupationalFields.json");
  const arrangements = await d3.json("arrangements.json");
  const dataKeys = await d3.json("dataKeys.json");

  // Add additional data fields to each councillor
  const today = new Date();
  dataset.forEach((councillor) => {
    // Add age group
    const birthDate = new Date(councillor.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    const tens = age.toString()[0];
    Object.keys(arrangements.ageGroups).forEach((group) => {
      if (group.startsWith(tens)) {
        councillor.ageGroup = group;
      }
    });
    // Add occupational field
    councillor.occupationalField = occupationalFields[councillor.id];

    // Add number of (active) committee memberships
    let nr = 0;
    councillor.committeeMemberships.forEach((ms) => {
      if (!ms.leavingDate) {
        nr++;
      }
    });
    councillor.nrOfCommittees = nr;
  });

  const cmts = [];
  dataset.forEach((councillor) => {
    let nr = 0;
    councillor.committeeMemberships.forEach((ms) => {
      if (!ms.leavingDate) {
        nr++;
        // cmts.push(`${ms.committee.code} @@@ ${ms.committee.name}`);
      }
    })
    cmts.push(nr);
  })

  const UCmts = [...new Set(cmts)];
  console.log(UCmts);

  // Prepare the SVG
  ///////////////////////////////////////////////

  // Set dimensions
  const dimensions = {
    width: 1000,
    height: 400,
    margins: {
      top: 50,
      right: 200,
      bottom: 50,
      left: 50,
    },
    ctrWidth: null,
    ctrHeight: null,
  };

  // Create and set inner container width
  dimensions.ctrWidth =
    dimensions.width - (dimensions.margins.left + dimensions.margins.right);
  // Create and set inner container height
  dimensions.ctrHeight =
    dimensions.height - (dimensions.margins.top + dimensions.margins.bottom);

  // Create SVG element
  const svg = d3
    .select("#parliament")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin")
    .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`);

  // Add inner container to SVG
  const ctr = svg
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.margins.left}, ${dimensions.margins.top})`
    );

  // Set the max number of seats per seating row
  const maxSeatsPerRow = 30;

  // Get tooltip element from DOM
  const tooltip = d3.select("#tooltip");

  // Arrange the seating
  ///////////////////////////////////////////////

  // Function to create the seating
  const drawArrangement = (
    arrangement,
    outerXDomain,
    innerXDomain,
    yDomain
  ) => {
    // Create the actual outer x-scale
    const xScaleOuter = d3
      .scaleBand()
      .domain(outerXDomain)
      .range([0, dimensions.ctrWidth])
      .paddingInner(0.2) // Space between groups of x-axis items
      .paddingOuter(0.2)
      .align(0.5);

    const xScaleInner = d3
      .scaleBand()
      .domain(innerXDomain)
      .range([0, xScaleOuter.bandwidth()])
      .paddingInner(0.2);

    // Create the actual y-scale
    const yScale = d3
      .scaleBand()
      .domain(yDomain)
      .range([0, dimensions.ctrHeight])
      .paddingInner(0.1);

    // Create x-axis
    const xAxis = d3.axisBottom(xScaleOuter).tickSize(0).tickSizeOuter(0);

    // Draw x-axis
    const xAxisLine = ctr
      .append("g")
      .attr("id", "x-axis")
      .style("font-size", "8px")
      .attr("transform", `translate(0, ${dimensions.ctrHeight})`)
      .call(xAxis);

    if (arrangement === "occupationalFields" || arrangement === "committee") {
      xAxisLine
        .selectAll("text")
        .transition()
        .duration(2000)
        .style("text-anchor", "start")
        .attr("dy", "-.05em")
        .attr("dx", "-1em")
        .attr("transform", "rotate(-90)");
    }

    // Remove the horizontal x-axis line
    xAxisLine.call((axis) => axis.select(".domain").remove());

    const seatsGroup = ctr.append("g").attr("class", "seats");

    seatsGroup
      .selectAll("g")
      .data(dataset)
      .join("g")
      .attr("class", "seat")
      .attr("transform", (d) => {
        if (arrangement === "names") {
          return `translate(${+xScaleOuter("")}, 0)`;
        } else {
          const dataKey = dataKeys[arrangement]; // e.g. faction
          const thisArrangement = d[dataKey]; // arrangement value of current counsillor
          const domainKey =
            arrangements[arrangement][thisArrangement][language]; // Needed key
          return `translate(${+xScaleOuter(domainKey)}, 0)`;
        }
      }) // Position along the main x-axis
      .attr("id", (d) => d.id)
      .append("circle")
      .attr("class", "councillor")
      .attr("cx", (d) => {
        // Get index of inner Scale
        const iIdx = d.innerIdx % innerXDomain.length;
        return xScaleInner(iIdx) + xScaleInner.bandwidth() / 2;
      })
      .attr("cy", (d) => {
        const yIdx = Math.floor(d.innerIdx / innerXDomain.length);
        return yScale(yIdx);
      })
      .attr("r", () => {
        let r = xScaleInner.bandwidth() / 2;
        if (yScale.bandwidth() / 2 < r) {
          r = yScale.bandwidth() / 2;
        }
        return r;
      })
      .attr("fill", (d) => {
        if (order === "names") {
          return arrangements.parties[d.party].color;
        } else {
          const dataKey = dataKeys[order]; // faction
          const thisArrangement = d[dataKey]; // arrangement value of current counsillor
          return arrangements[order][thisArrangement].color;
        }
      })
      .on("mouseover", (_, datum) => {
        tooltip.style("display", "block");
        onmousemove = (e) => {
          tooltip
            .style("left", e.pageX + 25 + "px")
            .style("top", e.pageY - 50 + "px");
        };
        tooltip.select(".name").text(`${datum.firstName} ${datum.lastName}`);
        tooltip.select(".info").text(() => {
          if (order !== "names") {
            return `${arrangements[order][datum[dataKeys[order]]][language]}`;
          } else {
            return `${arrangements.parties[datum.party][language]}`;
          }
        });
      })
      .on("mouseout", () => {
        tooltip.style("display", "none");
      });

    // Add legend
    ///////////////////////////////////////////////

    const createLegend = (thisOrder) => {
      d3.selectAll(".legend").remove();
      // Create legend keys
      legendKeys = Object.keys(arrangements[thisOrder]).map((key) => key);

      const spacingVertical = 12;
      const circleRadius = 4;
      const spacingHorizontal2 = 7;

      // Add legend group
      const legendGroup = svg
        .append("g")
        .attr("class", "legend")
        .style("font-size", "8px")
        .attr(
          "transform",
          `translate(${dimensions.ctrWidth + 100}, ${dimensions.margins.top})`
        );

      // Add <g> for each legend item
      const legendItems = legendGroup
        .selectAll("g")
        .data(d3.sort(legendKeys))
        .join("g")
        .attr("transform", (_, i) => `translate(0, ${i * spacingVertical})`);

      // Draw the legend circles for selected legend keys
      legendItems
        .append("circle")
        .transition()
        .duration(1000)
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", circleRadius)
        .attr("fill", (d) => arrangements[thisOrder][d].color);

      // Write the legend keys next to the legend circles
      legendItems
        .append("text")
        .attr("opacity", 0)
        .transition()
        .duration(1000)
        .attr("opacity", 1)
        .attr("x", spacingHorizontal2)
        .attr("y", circleRadius / 2)
        .text((d) => arrangements[thisOrder][d][language]);
    }

    if (order !== "names") {
      createLegend(order);
    } else {
      d3.selectAll(".legend").remove();
    }

    // Update general seat arrangement
    ///////////////////////////////////////////////

    // I hate this approach. Could someone teach me how to do proper
    // transistioning with the join method !!!
    const updateSeatArrangement = (
      newArrangement,
      newOrder,
      newXOuter,
      newXInner,
      newYDomain
    ) => {
      const newOuterXScale = xScaleOuter.domain(newXOuter);

      const newInnerXScale = xScaleInner
        .domain(newXInner)
        .range([0, newOuterXScale.bandwidth()]);

      const newYScale = yScale.domain(newYDomain);

      const x = d3.select("#x-axis");
      x.transition()
        .duration(1000)
        .call(d3.axisBottom(newOuterXScale).tickSize(0).tickSizeOuter(0));
      // Remove the horizontal x-axis line
      x.call((axis) => axis.select(".domain").remove());

      if (
        newArrangement === "occupationalFields" ||
        arrangement === "committee"
      ) {
        x.selectAll("text")
          .transition()
          .duration(2000)
          .style("text-anchor", "start")
          .attr("dy", "-.05em")
          .attr("dx", "-1em")
          .attr("transform", "rotate(-90)");
      }

      // Update the position of the seats
      d3.selectAll(".seat")
        .transition()
        .duration(2000)
        .attr("transform", (d) => {
          if (newArrangement === "names") {
            return `translate(${+newOuterXScale("")}, 0)`;
          } else {
            const dataKey = dataKeys[newArrangement]; // faction
            const thisArrangement = d[dataKey]; // arrangement value of current counsillor
            const domainKey =
              arrangements[newArrangement][thisArrangement][language]; // Needed key
            return `translate(${+newOuterXScale(domainKey)}, 0)`;
          }
        }); // Position along the main x-axis

      d3.selectAll(".councillor")
        .on("mouseover", (_, datum) => {
          tooltip.style("display", "block");
          onmousemove = (e) => {
            tooltip
              .style("left", e.pageX + 25 + "px")
              .style("top", e.pageY - 50 + "px");
          };
          tooltip.select(".name").text(`${datum.firstName} ${datum.lastName}`);
          tooltip.select(".info").text(() => {
            if (newOrder !== "names") {
              return `${
                arrangements[newOrder][datum[dataKeys[newOrder]]][language]
              }`;
            } else {
              return `${arrangements.parties[datum.party][language]}`;
            }
          });
        })
        .on("mouseout", () => {
          tooltip.style("display", "none");
        })
        .transition()
        .duration(2000)
        .attr("cx", (d) => {
          // Get index of inner Scale
          const iIdx = d.innerIdx % newXInner.length;
          return newInnerXScale(iIdx) + newInnerXScale.bandwidth() / 2;
        })
        .attr("cy", (d) => {
          const yIdx = Math.floor(d.innerIdx / newXInner.length);
          return newYScale(yIdx);
        })
        .attr("r", () => {
          let r = newInnerXScale.bandwidth() / 2;
          if (newYScale.bandwidth() / 2 < r) {
            r = newYScale.bandwidth() / 2;
          }
          return r;
        })
        .attr("fill", (d) => {
          if (newOrder === "names") {
            return arrangements.parties[d.party].color;
          } else {
            const dataKey = dataKeys[newOrder]; // faction
            const thisArrangement = d[dataKey]; // arrangement value of current counsillor
            return arrangements[newOrder][thisArrangement].color;
          }
        });

        if (newOrder !== "names") {
          createLegend(newOrder);
        } else {
          d3.selectAll(".legend").remove();
        }
    };

    // Listen to changes on the seat arrangement
    d3.select("#arrangement").on("change", (event) => {
      event.preventDefault();
      const newArrangement = event.target.value;
      const newOrder = d3.select("#order").node().value;
      const newXOuter = getOuterXDomain(newArrangement);
      const newXInner = getInnerXDomain(newXOuter.length);
      const newYDomain = getYDomain(newArrangement, newOrder, newXInner.length);
      updateSeatArrangement(
        newArrangement,
        newOrder,
        newXOuter,
        newXInner,
        newYDomain
      );
    });

    // Listen to changes on group order
    d3.select("#order").on("change", (event) => {
      event.preventDefault();
      const newOrder = event.target.value;
      const newArrangement = d3.select("#arrangement").node().value;
      const newXOuter = getOuterXDomain(newArrangement);
      const newXInner = getInnerXDomain(newXOuter.length);
      const newYDomain = getYDomain(newArrangement, newOrder, newXInner.length);
      updateSeatArrangement(
        newArrangement,
        newOrder,
        newXOuter,
        newXInner,
        newYDomain
      );
    });
  };

  // Function to get the get outer x-scale items and domain
  const getOuterXDomain = (arrangement) => {
    // Outer x-Scale - depends on the arrangement
    let xOuterItems, xOuterDomain;

    // Set the outer x-scale domain
    if (arrangement === "names") {
      // If arranged by name, all councillors belong to the same group
      xOuterItems = [""];
      xOuterDomain = [""];
    } else {
      // Else, the councillors are grouped by the selected arrangement
      xOuterItems = Object.keys(arrangements[arrangement]);
      xOuterDomain = xOuterItems.map(
        (item) => arrangements[arrangement][item][language]
      );
    }
    return xOuterDomain;
  };

  // Function to get the inner x-scale domain
  const getInnerXDomain = (nrOfOuterGroups) => {
    let xInnerDomain;
    // The inner scale is given by the maxSeatsPerRow divided by number of outer groups
    xInnerDomain = Array.from(
      Array(Math.ceil(maxSeatsPerRow / nrOfOuterGroups)).keys()
    );
    return xInnerDomain;
  };

  // Function to get the y-scale domain
  // ...and to add/change special inner indices !!!
  const getYDomain = (arrangement, order, nrOfInnerGroups) => {
    // y-Scale - depends on largest group: Number of members / xInnerDomain
    let yScaleDomain;

    if (arrangement === "names") {
      yScaleDomain = Array.from(
        Array(Math.ceil(dataset.length / maxSeatsPerRow)).keys()
      );

      dataset.sort((a, b) => {
        return d3.ascending(a[dataKeys[order]], b[dataKeys[order]]);
      });

      // Add innerIdx
      dataset.forEach((item, index) => {
        item.innerIdx = index;
      });
    } else {
      // Group the dataset by the selected arrangement
      groupedDataset = d3.groups(dataset, (d) => d[dataKeys[arrangement]]);
      // E.g. dataset = [
      //   [ "VS", [...] ],
      //   [ "S", [...] ],
      //   ...
      // ]

      groupedDataset.forEach((group) => {
        // Sort group according to order
        group[1].sort((a, b) => {
          return d3.ascending(a[dataKeys[order]], b[dataKeys[order]]);
        });

        // Add innerIdx to get positioning right later
        group[1].forEach((item, index) => {
          const datasetItem = dataset.find(({ id }) => id === item.id);
          datasetItem.innerIdx = index;
        });
      });

      // Get the number of members of the largest group
      const largestGroup = d3.max(groupedDataset, (group) => {
        return group[1].length;
      });

      // Set the y-scale domain
      // It's the number of seat rows of the largest group
      yScaleDomain = Array.from(
        Array(Math.ceil(largestGroup / nrOfInnerGroups)).keys()
      );
    }
    return yScaleDomain;
  };

  // Get the arrangement and order
  const arrangement = d3.select("#arrangement").node().value;
  const order = d3.select("#order").node().value;
  // Get the actual outer x-scale domain
  const outerXDomain = getOuterXDomain(arrangement);
  // Get the actual inner x-scale domain
  const innerXDomain = getInnerXDomain(outerXDomain.length);
  // Get the actual y-scale domain
  const yDomain = getYDomain(arrangement, order, innerXDomain.length);
  drawArrangement(arrangement, outerXDomain, innerXDomain, yDomain);
};

drawParliament();
