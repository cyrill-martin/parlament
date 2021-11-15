// Set the language
let language = "de";

// The possible seating arrangements
const arrangements = {
  parties: {
    BastA: {
      color: "#e6007e",
      de: "BastA",
      fr: "BastA",
      it: "BastA",
      rm: "BastA",
      en: "BastA",
    },
    EàG: {
      color: "#6a0f5a",
      de: "EàG",
      fr: "EàG",
      it: "EàG",
      rm: "EàG",
      en: "EàG",
    },
    SP: {
      color: "#e4022d",
      de: "SP",
      fr: "PS",
      it: "PS",
      rm: "PS",
      en: "Social Democrats",
    },
    PdA: {
      color: "#e30613",
      de: "PdA",
      fr: "PdA",
      it: "PdA",
      rm: "PdA",
      en: "PdA",
    },
    GRÜNE: {
      color: "#84b414",
      de: "Grüne",
      fr: "VERT-E-S",
      it: "Verdi",
      rm: "Verda",
      en: "Green Group",
    },
    Al: {
      color: "#84b414",
      de: "Al",
      fr: "Al",
      it: "Al",
      rm: "Al",
      en: "Al",
    },
    glp: {
      color: "#004b32",
      de: "Grünliberale",
      fr: "Vert'Libéral",
      it: "Verde Liberale",
      rm: "Verdiliberala",
      en: "Green Liberals",
    },
    "FDP-Liberale": {
      color: "#0e52a0",
      de: "FDP-Liberale",
      fr: "Libéral-Radical",
      it: "Liberale Radicale",
      rm: "Liberaldemocratica",
      en: "The Liberals",
    },
    "M-E": {
      color: "#003c69",
      de: "Mitte",
      fr: "Centre",
      it: "Centro",
      rm: "Center",
      en: "The Centre",
    },
    LDP: {
      color: "#0251a0",
      de: "LDP",
      fr: "LDP",
      it: "LDP",
      rm: "LDP",
      en: "LDP",
    },
    EVP: {
      color: "#ffdd00",
      de: "EVP",
      fr: "EVP",
      it: "EVP",
      rm: "EVP",
      en: "EVP",
    },
    EDU: {
      color: "#000000",
      de: "EDU",
      fr: "EDU",
      it: "EDU",
      rm: "EDU",
      en: "EDU",
    },
    Lega: {
      color: "#0a2f42",
      de: "Lega",
      fr: "Lega",
      it: "Lega",
      rm: "Lega",
      en: "Lega",
    },
    SVP: {
      color: "#65b292",
      de: "SVP",
      fr: "UDC",
      it: "UDC",
      rm: "PPS",
      en: "Swiss People's Party",
    },
  },
  fractions: {
    S: {
      color: "#e4022d",
      de: "SP",
      fr: "PS",
      it: "PS",
      rm: "PS",
      en: "Social Democrats",
    },
    G: {
      color: "#84b414",
      de: "Grüne",
      fr: "VERT-E-S",
      it: "Verdi",
      rm: "Verda",
      en: "Green Group",
    },
    GL: {
      color: "#004b32",
      de: "Grünliberale",
      fr: "Vert'Libéral",
      it: "Verde Liberale",
      rm: "Verdiliberala",
      en: "Green Liberal Group",
    },
    RL: {
      color: "#0e52a0",
      de: "FDP-Liberale",
      fr: "Libéral-Radical",
      it: "Liberale Radicale",
      rm: "Liberaldemocratica",
      en: "The Liberals Group",
    },
    "M-E": {
      color: "#003c69",
      de: "Mitte",
      fr: "Centre",
      it: "Centro",
      rm: "Center",
      en: "The Centre Group",
    },
    V: {
      color: "#65b292",
      de: "SVP",
      fr: "UDC",
      it: "UDC",
      rm: "PPS",
      en: "Swiss People's Party",
    },
  },
  genders: {
    f: {
      color: "#DEE2E6",
      de: "Frauen",
      fr: "Femme",
      it: "Donna",
      rm: "Dunna",
      en: "Woman",
    },
    m: {
      color: "#495057",
      de: "Männer",
      fr: "Femme",
      it: "Donna",
      rm: "Dunna",
      en: "Man",
    },
  },
  ageGroups: {
    "18-19": {
      color: "#F8F9FA",
      de: "18-20",
      fr: "18-20",
      it: "18-20",
      rm: "18-20",
      en: "18-20",
    },
    "20-29": {
      color: "#E9ECEF",
      de: "20-29",
      fr: "20-29",
      it: "20-29",
      rm: "20-29",
      en: "20-29",
    },
    "30-39": {
      color: "#DEE2E6",
      de: "30-39",
      fr: "30-39",
      it: "30-39",
      rm: "30-39",
      en: "30-39",
    },
    "40-49": {
      color: "#CED4DA",
      de: "40-49",
      fr: "40-49",
      it: "40-49",
      rm: "40-49",
      en: "40-49",
    },
    "50-59": {
      color: "#ADB5BD",
      de: "50-59",
      fr: "50-59",
      it: "50-59",
      rm: "50-59",
      en: "50-59",
    },
    "60-69": {
      color: "#6C757D",
      de: "60-69",
      fr: "60-69",
      it: "60-69",
      rm: "60-69",
      en: "60-69",
    },
    "70-79": {
      color: "#495057",
      de: "70-79",
      fr: "70-79",
      it: "70-79",
      rm: "70-79",
      en: "70-79",
    },
    "80-89": {
      color: "#343A40",
      de: "80-89",
      fr: "80-89",
      it: "80-89",
      rm: "80-89",
      en: "80-89",
    },
    "90-99": {
      color: "#212529",
      de: "90-99",
      fr: "90-99",
      it: "90-99",
      rm: "90-99",
      en: "90-99",
    },
  },
  cantons: {
    AG: { color: "#666666", de: "AG", fr: "AG", it: "AG", rm: "AG", en: "AG" },
    AI: { color: "#4d4d4d", de: "AI", fr: "AI", it: "AI", rm: "AI", en: "AI" },
    AR: { color: "#333333", de: "AR", fr: "AR", it: "AR", rm: "AR", en: "AR" },
    BE: { color: "#fff0b3", de: "BE", fr: "BE", it: "BE", rm: "BE", en: "BE" },
    BL: { color: "#ef7876", de: "BL", fr: "BL", it: "BL", rm: "BL", en: "BL" },
    BS: { color: "#1a1a1a", de: "BS", fr: "BS", it: "BS", rm: "BS", en: "BS" },
    FR: { color: "#000000", de: "FR", fr: "FR", it: "FR", rm: "FR", en: "FR" },
    GE: { color: "#ffe680", de: "GE", fr: "GE", it: "GE", rm: "GE", en: "GE" },
    GL: { color: "#ec625f", de: "GL", fr: "GL", it: "GL", rm: "GL", en: "GL" },
    GR: { color: "#bedff4", de: "GR", fr: "GR", it: "GR", rm: "GR", en: "GR" },
    JU: { color: "#ea4b48", de: "JU", fr: "JU", it: "JU", rm: "JU", en: "JU" },
    LU: { color: "#93caec", de: "LU", fr: "LU", it: "LU", rm: "LU", en: "LU" },
    NE: { color: "#61ea96", de: "NE", fr: "NE", it: "NE", rm: "NE", en: "NE" },
    NW: { color: "#e8423f", de: "NW", fr: "NW", it: "NW", rm: "NW", en: "NW" },
    OW: { color: "#e73532", de: "OW", fr: "OW", it: "OW", rm: "OW", en: "OW" },
    SG: { color: "#34e578", de: "SG", fr: "SG", it: "SG", rm: "SG", en: "SG" },
    SH: { color: "#ffdb4d", de: "SH", fr: "SH", it: "SH", rm: "SH", en: "SH" },
    SO: { color: "#e41e1b", de: "SO", fr: "SO", it: "SO", rm: "SO", en: "SO" },
    SZ: { color: "#cd1b18", de: "SZ", fr: "SZ", it: "SZ", rm: "SZ", en: "SZ" },
    TG: { color: "#1acb5e", de: "TG", fr: "TG", it: "TG", rm: "TG", en: "TG" },
    TI: { color: "#67b4e4", de: "TI", fr: "TI", it: "TI", rm: "TI", en: "TI" },
    UR: { color: "#ffd730", de: "UR", fr: "UR", it: "UR", rm: "UR", en: "UR" },
    VD: { color: "#16a74e", de: "VD", fr: "VD", it: "VD", rm: "VD", en: "VD" },
    VS: { color: "#b71815", de: "VS", fr: "VS", it: "VS", rm: "VS", en: "VS" },
    ZG: { color: "#3c9fdd", de: "ZG", fr: "ZG", it: "ZG", rm: "ZG", en: "ZG" },
    ZH: { color: "#248bcc", de: "ZH", fr: "ZH", it: "ZH", rm: "ZH", en: "ZH" },
  },
  languages: {
    de: {
      color: "#495057",
      de: "Deutsch",
      fr: "de",
      it: "de",
      rm: "de",
      en: "de",
    },
    fr: {
      color: "#DEE2E6",
      de: "Französisch",
      fr: "fr",
      it: "fr",
      rm: "fr",
      en: "fr",
    },
    it: {
      color: "#ADB5BD",
      de: "Italienisch",
      fr: "it",
      it: "it",
      rm: "it",
      en: "it",
    },
    rm: {
      color: "#12873f",
      de: "Rätoromanisch",
      fr: "rm",
      it: "rm",
      rm: "rm",
      en: "rm",
    },
    sk: {
      color: "#17b554",
      de: "Slowakisch",
      fr: "sk",
      it: "sk",
      rm: "sk",
      en: "sk",
    },
    tr: {
      color: "#34e578",
      de: "Türkisch",
      fr: "tr",
      it: "tr",
      rm: "tr",
      en: "tr",
    },
  },
  workingLanguages: {
    de: {
      color: "#495057",
      de: "Deutsch",
      fr: "de",
      it: "de",
      rm: "de",
      en: "de",
    },
    fr: {
      color: "#DEE2E6",
      de: "Französisch",
      fr: "fr",
      it: "fr",
      rm: "fr",
      en: "fr",
    },
  },
  occupationalFields: {
    Bankenwesen: {
      color: "#0059b3",
      de: "Bankenwesen",
      fr: "Bankenwesen",
      it: "Bankenwesen",
      rm: "Bankenwesen",
      en: "Bankenwesen",
    },
    Bauwesen: {
      color: "#808080",
      de: "Bauwesen",
      fr: "Bauwesen",
      it: "Bauwesen",
      rm: "Bauwesen",
      en: "Bauwesen",
    },
    Beratungswesen: {
      color: "#99ccff",
      de: "Beratungswesen",
      fr: "Beratungswesen",
      it: "Beratungswesen",
      rm: "Beratungswesen",
      en: "Beratungswesen",
    },
    Bildungswesen: {
      color: "#ff7733",
      de: "Bildungswesen",
      fr: "Bildungswesen",
      it: "Bildungswesen",
      rm: "Bildungswesen",
      en: "Bildungswesen",
    },
    Elektroinstallationen: {
      color: "#404040",
      de: "Elektroinstallationen",
      fr: "Elektroinstallationen",
      it: "Elektroinstallationen",
      rm: "Elektroinstallationen",
      en: "Elektroinstallationen",
    },
    Energiewesen: {
      color: "#e6e600",
      de: "Energiewesen",
      fr: "Energiewesen",
      it: "Energiewesen",
      rm: "Energiewesen",
      en: "Energiewesen",
    },
    Funktechnik: {
      color: "#a6a6a6",
      de: "Funktechnik",
      fr: "Funktechnik",
      it: "Funktechnik",
      rm: "Funktechnik",
      en: "Funktechnik",
    },
    Gartenbau: {
      color: "#248f24",
      de: "Gartenbau",
      fr: "Gartenbau",
      it: "Gartenbau",
      rm: "Gartenbau",
      en: "Gartenbau",
    },
    Gesundheitswesen: {
      color: "#ff0000",
      de: "Gesundheitswesen",
      fr: "Gesundheitswesen",
      it: "Gesundheitswesen",
      rm: "Gesundheitswesen",
      en: "Gesundheitswesen",
    },
    Ingenieurwesen: {
      color: "#d9d9d9",
      de: "Ingenieurwesen",
      fr: "Ingenieurwesen",
      it: "Ingenieurwesen",
      rm: "Ingenieurwesen",
      en: "Ingenieurwesen",
    },
    Landwirtschaftswesen: {
      color: "#33cc33",
      de: "Landwirtschaftswesen",
      fr: "Landwirtschaftswesen",
      it: "Landwirtschaftswesen",
      rm: "Landwirtschaftswesen",
      en: "Landwirtschaftswesen",
    },
    Naturwissenschaften: {
      color: "#85e085",
      de: "Naturwissenschaften",
      fr: "Naturwissenschaften",
      it: "Naturwissenschaften",
      rm: "Naturwissenschaften",
      en: "Naturwissenschaften",
    },
    Politik: {
      color: "#ff9999",
      de: "Politik",
      fr: "Politik",
      it: "Politik",
      rm: "Politik",
      en: "Politik",
    },
    Rechtswesen: {
      color: "#bf8040",
      de: "Rechtswesen",
      fr: "Rechtswesen",
      it: "Rechtswesen",
      rm: "Rechtswesen",
      en: "Rechtswesen",
    },
    Schuhe: {
      color: "#ff3399",
      de: "Schuhe",
      fr: "Schuhe",
      it: "Schuhe",
      rm: "Schuhe",
      en: "Schuhe",
    },
    Transportwesen: {
      color: "#595959",
      de: "Transportwesen",
      fr: "Transportwesen",
      it: "Transportwesen",
      rm: "Transportwesen",
      en: "Transportwesen",
    },
    Veranstaltungswesen: {
      color: "#ff66cc",
      de: "Veranstaltungswesen",
      fr: "Veranstaltungswesen",
      it: "Veranstaltungswesen",
      rm: "Veranstaltungswesen",
      en: "Veranstaltungswesen",
    },
    Verlagswesen: {
      color: "#cc33ff",
      de: "Verlagswesen",
      fr: "Verlagswesen",
      it: "Verlagswesen",
      rm: "Verlagswesen",
      en: "Verlagswesen",
    },
    Versicherungswesen: {
      color: "#3399ff",
      de: "Versicherungswesen",
      fr: "Versicherungswesen",
      it: "Versicherungswesen",
      rm: "Versicherungswesen",
      en: "Versicherungswesen",
    },
  },
};

const dataKeys = {
  fractions: "faction",
  genders: "gender",
  names: "firstName",
  parties: "party",
  ageGroups: "ageGroup",
  cantons: "cantonName",
  languages: "language",
  workingLanguages: "workLanguage",
  occupationalFields: "occupationalField",
};

const drawParliament = async () => {
  // Load the data
  let dataset = await d3.json("N_council.json");

  const occupationalFields = await d3.json("occupationalFields.json");

  // Add age group and occupational field to each councillor
  const today = new Date();
  dataset.forEach((councillor) => {
    // Age group
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
    // Occupational field
    councillor.occupationalField = occupationalFields[councillor.id];
  });

  // const langs = dataset.map((c) => c.occupationalField);
  // const uLangs = [...new Set(langs)];
  // console.log(uLangs);

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

  // Add inner legend container to SVG
  const legend = svg
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.ctrWidth}, ${dimensions.margins.top})`
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

    if (arrangement === "occupationalFields") {
      xAxisLine
        .selectAll("text")
        .transition()
        .duration(2000)
        .style("text-anchor", "start")
        .attr("dy", "-1em")
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
          const dataKey = dataKeys[arrangement]; // faction
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

     

    legend
      .selectAll(".legendItem")
      .data(arrangements[order])
      .join("g")
      .class("legendItem")
      .append("circle")
    

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

      if (newArrangement === "occupationalFields") {
        x.selectAll("text")
          .transition()
          .duration(2000)
          .style("text-anchor", "start")
          .attr("dy", "-1em")
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

      d3
        .selectAll(".councillor")
        .on("mouseover", (_, datum) => {
          tooltip.style("display", "block");
          onmousemove = (e) => {
            tooltip
              .style("left", e.pageX + 25 + "px")
              .style("top", e.pageY - 50 + "px");
          };
          tooltip.select(".name").text(`${datum.firstName} ${datum.lastName}`);
          tooltip
            .select(".info")
            .text(() => {
              if (newOrder !== "names") {
                return `${arrangements[newOrder][datum[dataKeys[newOrder]]][language]}`
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
        })

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
      Array(Math.floor(maxSeatsPerRow / nrOfOuterGroups)).keys()
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

        // Add innerIdx to get positioning right
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
