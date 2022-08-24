<template>
  <div id="parliament">
    <div id="tooltip">
      <div class="name"></div>
      <div class="arrangement"></div>
      <div class="order"></div>
    </div>
  </div>
</template>

<script>
// import * as d3 from "d3";
import d3 from "../d3-importer.js";
// Load the data
import dataset from "../data/N_council.json";
import occupationalFields from "../data/occupationalFields.json";
import paidConcerns from "../data/paidConcerns.json";
import arrangements from "../data/arrangements.json";
import selections from "../data/selections.json";

export default {
  props: ["lang"],
  async mounted() {
    await this.drawParliament();
    // this.language = this.lang;
    this.checkUrl();
  },
  data() {
    return {
      dataset,
      occupationalFields,
      paidConcerns,
      arrangements,
      selections,
      language: "de",
    };
  },
  watch: {
    lang(newLanguage) {
      this.language = newLanguage;
      const newArrangement = d3.select("#arrangement").node().value;      
      const newOrder = d3.select("#order").node().value;
      this.updateUrl(newArrangement, newOrder)
      this.drawParliament();
    },
  },
  methods: {
    updateUrl(arr, ord) {
      history.pushState(
        {},
        null,
        `${this.$route.path}?arr=${arr}&ord=${ord}&lang=${this.language}`
      )
    },
    async checkUrl() {
      console.log("Checking the URL parameters");

      try {
        await this.$router.isReady()
        // onSuccess

        const params = this.$route.query;

        if (params.lang) {
          this.$emit("changeLanguage", params.lang)
        } else {
          this.language = this.lang;
        }

        if (params.arr) {
          this.setDropdownSelection("arrangement", params.arr)
        }

        if (params.ord) {
          this.setDropdownSelection("order", params.ord)
        }

      } catch (err) {
        // onError
      }

    },
    setDropdownSelection(id, option) {
      const element = document.getElementById(id);
      console.log(element)
      element.value = option;
      element.dispatchEvent(new Event('change'))

    },
    async drawParliament() {
      d3.select("svg").remove();
      // Add additional data fields to each councillor
      const today = new Date();
      this.dataset.forEach((councillor) => {
        // Get age
        const birthDate = new Date(councillor.birthDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        // Add age
        councillor.age = age;

        // Add age group
        const tens = age.toString()[0];
        Object.keys(this.arrangements.ageGroup).forEach((group) => {
          if (group.startsWith(tens)) {
            councillor.ageGroup = group;
          }
        });
        // Add occupational field
        councillor.occupationalField = this.occupationalFields[councillor.id];

        // Add number of (active) committee memberships
        let nr = 0;
        councillor.committeeMemberships.forEach((ms) => {
          if (!ms.leavingDate) {
            nr++;
          }
        });
        councillor.nrOfCommittees = nr;

        // Add total number of council memberships
        councillor.nrOfCouncilMemberships =
          councillor.councilMemberships.length;

        // Add total number of concerns
        councillor.nrOfConcerns = councillor.concerns.length;

        // Add number of paid concerns
        councillor.nrOfPaidConcerns = this.paidConcerns[councillor.id];

        // Add number of voluntary concerns
        councillor.nrOfVoluntaryConcerns =
          councillor.nrOfConcerns - councillor.nrOfPaidConcerns;
      });

      // Prepare the SVG
      ///////////////////////////////////////////////

      // Set dimensions
      const dimensions = {
        width: 1000,
        height: 380,
        margins: {
          top: 40,
          right: 170,
          bottom: 30,
          left: 15,
        },
        ctrWidth: null,
        ctrHeight: null,
      };

      // Create and set inner container width
      dimensions.ctrWidth =
        dimensions.width - (dimensions.margins.left + dimensions.margins.right);
      // Create and set inner container height
      dimensions.ctrHeight =
        dimensions.height -
        (dimensions.margins.top + dimensions.margins.bottom);

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
        yDomain,
        colorScale
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
          .attr("transform", `translate(0, ${dimensions.ctrHeight})`)
          .call(xAxis);

        // Rotate axis tick labels
        if (arrangement === "occupationalField" || arrangement === "party") {
          xAxisLine
            .selectAll("text")
            .transition()
            .duration(2000)
            .style("text-anchor", "start")
            .attr("dy", "-.01em")
            .attr("dx", "-2em")
            .attr("transform", "rotate(-90)");
        }

        // Remove the horizontal x-axis line
        xAxisLine.call((axis) => axis.select(".domain").remove());

        // Add x-axis label
        ctr
          .append("g")
          .attr(
            "transform",
            `translate(${dimensions.ctrWidth / 2}, ${dimensions.ctrHeight + 28
            })`
          )
          .attr("id", "x-axis-label")
          .append("text")
          .style("font-size", "10px")
          .style("font-weight", "bold")
          .attr("text-anchor", "middle")
          .text(() => {
            if (arrangement !== "firstName") {
              return selections[arrangement][this.language];
            } else {
              return "";
            }
          });

        const seatsGroup = ctr.append("g").attr("class", "seats");

        seatsGroup
          .selectAll("g")
          .data(this.dataset)
          .join("g")
          .attr("class", "seat")
          .attr("transform", (d) => {
            if (
              !this.arrangements[arrangement] &&
              arrangement !== "firstName"
            ) {
              // It's numerical
              return `translate(${+xScaleOuter(d[arrangement])}, 0)`;
            } else {
              if (arrangement === "firstName") {
                return `translate(${+xScaleOuter("")}, 0)`;
              } else {
                return `translate(${+xScaleOuter(
                  this.arrangements[arrangement][d[arrangement]][this.language]
                )}, 0)`;
              }
            }
          }) // Position along the main x-axis
          .attr("id", (d) => d.id)
          .append("a")
          .attr(
            "xlink:href",
            (d) =>
              `https://www.parlament.ch/${this.language}/biografie/${d.firstName}-${d.lastName}/${d.id}`
          )
          .attr("target", "_blank")
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
            if (!this.arrangements[order] && order !== "firstName") {
              return colorScale(d[order]);
            } else {
              if (order === "firstName") {
                return this.arrangements.party[d.party].color;
              } else {
                return this.arrangements[order][d[order]].color;
              }
            }
          })
          .attr("cursor", "pointer")
          .on("mouseover touchstart", (_, datum) => {
            addMouseover(arrangement, order, datum);
          })
          .on("mouseout touchend", () => {
            tooltip.style("display", "none");
          });

        const addMouseover = (thisArrangement, thisOrder, data) => {
          tooltip.style("display", "block");

          onmousemove = (e) => {
            tooltip
              .style("left", e.clientX + 25 + "px")
              .style("top", e.clientY - 50 + "px");
          };

          tooltip.select(".name").text(`${data.firstName} ${data.lastName}`);

          tooltip.select(".arrangement").text(() => {
            if (
              !this.arrangements[thisArrangement] &&
              thisArrangement !== "firstName"
            ) {
              return `${data[thisArrangement]}`;
            } else {
              if (thisArrangement !== "firstName") {
                return `${this.arrangements[thisArrangement][data[thisArrangement]][
                  this.language
                ]
                  }`;
              } else {
                return `${this.arrangements.party[data.party][this.language]}`;
              }
            }
          });

          if (thisArrangement !== thisOrder) {
            tooltip.select(".order").text(() => {
              if (!this.arrangements[thisOrder] && thisOrder !== "firstName") {
                return `${data[thisOrder]}`;
              } else {
                if (thisOrder !== "firstName") {
                  return `${this.arrangements[thisOrder][data[thisOrder]][this.language]
                    }`;
                } else {
                  return `${this.arrangements.party[data.party][this.language]
                    }`;
                }
              }
            });
          } else {
            tooltip.select(".order").text("");
          }
        };

        // Add legend
        ///////////////////////////////////////////////
        const createLegend = (thisOrder, thisColorScale) => {
          d3.selectAll(".legend").remove();

          let legendKeys;

          if (
            !this.arrangements[thisOrder] &&
            thisOrder !== "firstName" &&
            thisOrder !== "age"
          ) {
            // It's numerical
            const max = d3.max(
              this.dataset,
              (councillor) => councillor[thisOrder]
            );
            legendKeys = Array.from(Array(max + 1).keys());

            if (thisOrder === "nrOfCouncilMemberships") {
              legendKeys.shift();
            }
          } else {
            if (thisOrder === "age") {
              thisOrder = "ageGroup";
            }
            // Create legend keys
            legendKeys = Object.keys(this.arrangements[thisOrder]).map(
              (key) => key
            );
          }

          let fct = 1;

          if (thisOrder === "nrOfConcerns") {
            fct = 0.7;
          } else if (
            thisOrder === "cantonName" ||
            thisOrder === "nrOfPaidConcerns" ||
            thisOrder === "nrOfVoluntaryConcerns"
          ) {
            fct = 0.85;
          }

          const spacingVertical = 15 * fct;
          const circleRadius = spacingVertical / 3;
          const spacingHorizontal = spacingVertical / 2;

          // Add legend group
          const legendGroup = svg
            .append("g")
            .attr("class", "legend")
            .style("font-size", `${circleRadius * 2}px`)
            .attr(
              "transform",
              `translate(${dimensions.ctrWidth + 22}, ${dimensions.margins.top
              })`
            );

          // Add legend title
          legendGroup
            .append("g")
            .append("text")
            .style("font-weight", "bold")
            .text(() => {
              if (thisOrder !== "firstName") {
                if (selections[thisOrder][this.language].startsWith("Anzahl")) {
                  let str = selections[thisOrder][this.language].replace(
                    "Anzahl ",
                    ""
                  );
                  str = str[0].toUpperCase() + str.slice(1);
                  return str;
                } else {
                  return selections[thisOrder][this.language];
                }
              } else {
                return selections.party[this.language];
              }
            });

          // Add <g> for each legend item
          const legendItems = legendGroup
            .selectAll(".legend-item")
            .data(legendKeys)
            .join("g")
            .attr("class", "legend-item")
            .attr(
              "transform",
              (_, i) =>
                `translate(${circleRadius}, ${spacingVertical + i * spacingVertical
                })`
            );

          // Draw the legend circles for selected legend keys
          legendItems
            .append("circle")
            .transition()
            .duration(1000)
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", circleRadius)
            .attr("fill", (d) => {
              if (thisColorScale) {
                return thisColorScale(d);
              } else {
                return this.arrangements[thisOrder][d].color;
              }
            });

          // Write the legend keys next to the legend circles
          legendItems
            .append("text")
            .attr("opacity", 0)
            .transition()
            .duration(1000)
            .attr("opacity", 1)
            .attr("x", spacingHorizontal)
            .attr("y", circleRadius / 2 + 1)
            .text((d) => {
              if (thisColorScale) {
                return d;
              } else {
                return this.arrangements[thisOrder][d][this.language];
              }
            });
        };

        if (order !== "firstName") {
          createLegend(order, colorScale);
        } else {
          createLegend("party", colorScale);
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
          newYDomain,
          newColorScale
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
            newArrangement === "occupationalField" ||
            newArrangement === "party"
          ) {
            x.selectAll("text")
              .transition()
              .duration(2000)
              .style("text-anchor", "start")
              .attr("dy", "-.05em")
              .attr("dx", "-1.5em")
              .attr("transform", "rotate(-90)");
          } else if (newArrangement === "faction") {
            x.selectAll("text")
              .transition()
              .duration(2000)
              .style("text-anchor", "middle")
              .attr("dy", "0")
              .attr("dx", "0")
              .attr("transform", "rotate(0)");
          }

          const xLabel = d3.select("#x-axis-label");
          xLabel
            .select("text")
            .transition()
            .duration(2000)
            .text(() => {
              if (newArrangement !== "firstName") {
                return selections[newArrangement][this.language];
              } else {
                return "";
              }
            });

          // Update the position of the seats
          d3.selectAll(".seat")
            .transition()
            .duration(2000)
            .attr("transform", (d) => {
              if (
                !this.arrangements[newArrangement] &&
                newArrangement !== "firstName"
              ) {
                // It's numerical
                return `translate(${+newOuterXScale(d[newArrangement])}, 0)`;
              } else {
                if (newArrangement === "firstName") {
                  return `translate(${+newOuterXScale("")}, 0)`;
                } else {
                  return `translate(${+newOuterXScale(
                    this.arrangements[newArrangement][d[newArrangement]][
                    this.language
                    ]
                  )}, 0)`;
                }
              }
            }); // Position along the main x-axis

          d3.selectAll(".councillor")
            .attr("cursor", "pointer")
            .on("mouseover touchstart", (_, datum) => {
              addMouseover(newArrangement, newOrder, datum);
            })
            .on("mouseout touchend", () => {
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
              if (
                !this.arrangements[newOrder] &&
                newOrder !== "firstName" &&
                newOrder !== "age"
              ) {
                return newColorScale(d[newOrder]);
              } else {
                if (newOrder === "firstName") {
                  return this.arrangements.party[d.party].color;
                } else if (newOrder === "age") {
                  return this.arrangements.ageGroup[d.ageGroup].color;
                } else {
                  return this.arrangements[newOrder][d[newOrder]].color;
                }
              }
            });

          if (newOrder !== "firstName") {
            createLegend(newOrder, newColorScale);
          } else {
            createLegend("party", newColorScale);
          }
        };

        const callUpdateFunction = (arrangement, order) => {
          const newColorScale = getColorScale(order);
          const newXOuter = getOuterXDomain(arrangement);
          const newXInner = getInnerXDomain(newXOuter.length);
          const newYDomain = getYDomain(arrangement, order, newXInner.length);
          updateSeatArrangement(
            arrangement,
            order,
            newXOuter,
            newXInner,
            newYDomain,
            newColorScale
          );
        };

        // Listen to changes on the seat arrangement
        d3.select("#arrangement").on("change", (event) => {
          event.preventDefault();
          const newArrangement = event.target.value;
          const newOrder = d3.select("#order").node().value;
          this.updateUrl(newArrangement, newOrder);
          callUpdateFunction(newArrangement, newOrder);
        });

        // Listen to changes on group order
        d3.select("#order").on("change", (event) => {
          event.preventDefault();
          const newOrder = event.target.value;
          const newArrangement = d3.select("#arrangement").node().value;
          this.updateUrl(newArrangement, newOrder);
          callUpdateFunction(newArrangement, newOrder);
        });
      };

      // Function to get the get outer x-scale items and domain
      const getOuterXDomain = (arrangement) => {
        // Outer x-Scale - depends on the arrangement
        let xOuterItems, xOuterDomain;

        // Set the outer x-scale domain

        if (!this.arrangements[arrangement] && arrangement !== "firstName") {
          // It's numerical
          // Get the max of all councillors
          const max = d3.max(
            this.dataset,
            (councillor) => councillor[arrangement]
          );
          if (arrangement === "age") {
            const min = d3.min(this.dataset, (councillor) => councillor.age);
            xOuterDomain = Array.from(
              { length: max - min + 1 },
              (_, i) => i + min
            );
          } else {
            xOuterDomain = Array.from(Array(max + 1).keys());
            if (arrangement === "nrOfCouncilMemberships") {
              xOuterDomain.shift();
            }
          }
        } else {
          if (arrangement === "firstName") {
            // If arranged by name, all councillors belong to the same group
            xOuterItems = [""];
            xOuterDomain = [""];
          } else {
            // Else, the councillors are grouped by the selected arrangement
            xOuterItems = Object.keys(this.arrangements[arrangement]);
            xOuterDomain = xOuterItems.map(
              (item) => this.arrangements[arrangement][item][this.language]
            );
          }
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

        if (arrangement === "firstName") {
          yScaleDomain = Array.from(
            Array(Math.ceil(this.dataset.length / maxSeatsPerRow)).keys()
          );

          this.dataset.sort((a, b) => {
            return d3.ascending(a[order], b[order]);
          });

          // Add innerIdx
          this.dataset.forEach((item, index) => {
            item.innerIdx = index;
          });
        } else {
          // Group the this.dataset by the selected arrangement
          const groupedDataset = d3.groups(this.dataset, (d) => d[arrangement]);
          // E.g. this.dataset = [
          //   [ "VS", [...] ],
          //   [ "S", [...] ],
          //   ...
          // ]

          groupedDataset.forEach((group) => {
            // Sort group according to order
            group[1].sort((a, b) => {
              return d3.ascending(a[order], b[order]);
            });

            // Add innerIdx to get positioning right later
            group[1].forEach((item, index) => {
              const datasetItem = this.dataset.find(({ id }) => id === item.id);
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

      // Function to get a possible linear color scale
      const getColorScale = (thisOrder) => {
        let colorScale;
        if (
          !this.arrangements[thisOrder] &&
          thisOrder !== "firstName" &&
          thisOrder !== "age"
        ) {
          // It's numerical

          // Get the max of all councillors
          const max = d3.max(
            this.dataset,
            (councillor) => councillor[thisOrder]
          );

          colorScale = d3
            .scaleLinear()
            .domain([0, max])
            .range(["lightgrey", "black"]);
        }
        return colorScale;
      };

      // Get the arrangement and order
      ///////////////////////////////////////////
      const arrangement = d3.select("#arrangement").node().value;
      const order = d3.select("#order").node().value;

      // Get the color scale (it's undefined or not)
      ///////////////////////////////////////////
      const colorScale = getColorScale(order);

      // Get the actual outer x-scale domain
      ///////////////////////////////////////////
      const outerXDomain = getOuterXDomain(arrangement);

      // Get the actual inner x-scale domain
      ///////////////////////////////////////////
      const innerXDomain = getInnerXDomain(outerXDomain.length);

      // Get the actual y-scale domain
      ///////////////////////////////////////////
      const yDomain = getYDomain(arrangement, order, innerXDomain.length);

      // Draw the parliament
      ///////////////////////////////////////////

      drawArrangement(
        arrangement,
        outerXDomain,
        innerXDomain,
        yDomain,
        colorScale
      );

      
    },
  },
};
</script>

<style scoped>
#tooltip {
  display: none;
  position: fixed;
  z-index: 10;
  background-color: white;
  border: solid 1px #333447;
  border-radius: 4px;
  padding: 5px;
}

.name {
  font-weight: bold;
}
</style>
