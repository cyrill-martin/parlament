<template>
  <div class="container page">
    <header>
      <div class="row">
        <div class="col-12">
          <div class="logo">
            <a href="/"><img :src="logo" alt="The kmapper logo" /></a>
          </div>
          <div class="languages">
            <button :class="{ isSelected: language === 'de' }" @click="setLanguage('de')">
              DE
            </button>
            <button :class="{ isSelected: language === 'fr' }" @click="setLanguage('fr')">
              FR
            </button>
            <button :class="{ isSelected: language === 'it' }" @click="setLanguage('it')">
              IT
            </button>
            <button :class="{ isSelected: language === 'rm' }" @click="setLanguage('rm')">
              RM
            </button>
            <button :class="{ isSelected: language === 'en' }" @click="setLanguage('en')">
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
    <main class="row" id="parlament">
      <section class="row">
        <div class="col-12">
          <div class="select-div title-select">
            <select name="council" id="council">
              <option value="N">{{ labels.councilN[language] }}</option>
              <option value="S">{{ labels.councilS[language] }}</option>
            </select>
          </div>
          <p>
            <span>{{ labels.intro1[language] }}</span>

            <span v-if="council === 'N'">{{ labels.intro2N[language] }}</span>
            <span v-else>{{ labels.intro2S[language] }}</span>

            <span v-if="council === 'N'">{{ labels.intro3N[language] }}</span>
            <span v-else>{{ labels.intro3S[language] }}</span>

            <span>{{ labels.intro4[language] }}</span>. 
            <span>{{ labels.status[language] }}</span> <span><b>{{ labels.date[language] }}</b></span>
            <a href="#about"><b>*</b></a>.
          </p>
        </div>
      </section>
      <section class="row">
        <div class="col-12" id="chart">
          <the-parliament :lang="language" @changeLanguage="setLanguage" @changeCouncil="setCouncil"></the-parliament>
        </div>
      </section>
      <section class="row" id="dropdowns">
        <div class="col-6">
          <the-dropdown :type="'arrangement'" :lang="language"></the-dropdown>
        </div>
        <div class="col-6">
          <the-dropdown :type="'order'" :lang="language"></the-dropdown>
        </div>
        <div class="col-12">
          <p>
            {{ labels.intro5[language] }}. {{ labels.intro6[language] }}.
          </p>
        </div>
      </section>
      <section class="row" id="about">
        <div class="col-12">
          <h3>* {{ labels.data[language] }}:</h3>
          <p>
            {{ labels.data0[language] }}. 
            {{ labels.data1[language] }}<a href="http://ws-old.parlament.ch" target="_blank">{{ labels.data2[language]
            }}</a>
            {{ labels.data3[language] }}<a href="https://www.parlament.ch" target="_blank">{{ labels.data3a[language] }}</a>
            {{ labels.data4[language] }} - <a
              href="https://github.com/cyrill-martin/parlament/blob/main/extras/get_councillors.py"
              target="_blank">script</a>. {{ labels.data5[language] }}<a href="https://github.com/cyrill-martin/parlament" target="_blank"> GitHub</a>.
          </p>
          <p>
            <br />
            Cyrill Martin<br />
            <a href="mailto:cyrill.martin@kmapper.com">cyrill.martin@kmapper.com</a>
          </p>
        </div>
      </section>
    </main>
    <footer class="row">
      <div class="col-12">
        &#169; 2024 <a href="https://kmapper.com" target="_blank">kmapper GmbH</a>
      </div>
    </footer>
  </div>
</template>

<script>
import TheParliament from "./components/TheParliament.vue";
import TheDropdown from "./components/TheDropdown.vue";
import labels from "./data/labels.json";

export default {
  name: "App",
  components: {
    TheParliament,
    TheDropdown,
  },
  data() {
    return {
      labels,
      language: "de",
      council: "N"
    };
  },
  computed: {
    logo() {
      return require("./assets/images/kmapper_k_3b.png");
    },
  },
  methods: {
    setLanguage(lang) {
      this.language = lang;
    },
    setCouncil(council) {
      this.council = council;
    }
  },
};
</script>

<style scoped>
.page {
  position: relative;
  min-height: 100vh;
  padding: 0 1.5rem;
}

header {
  height: 4rem;
  padding-top: 1rem;
}

.languages {
  font-size: 0.8rem;
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  z-index: 10;
}

.languages button {
  margin-left: 0.25rem;
  cursor: pointer;
  border: none;
  background: none;
}

.isSelected {
  font-weight: bold;
}

img {
  width: 120px;
}

option {
  font-size: 20px;
}

#parlament {
  margin: auto;
  width: 75%;
}

#chart {
  padding: 0
}

#dropdowns {
  padding-top: 0;
}

#about {
  margin-top: 4rem;
  margin-left: auto;
  margin-right: auto;
  width: 60%;
  font-size: 0.9rem;
}

.title-select select {
  font-size: 32px;
  font-weight: bold;
}

footer {
  margin-top: 2rem;
  height: 3rem;
}

@media only screen and (max-width: 65em) {
  header {
    padding-top: 0;
  }

  img {
    width: 90px;
  }

  .page {
    padding: 0;
  }

  .title-select select {
    font-size: 18px;
  }

  #parlament {
    margin: auto;
    width: 100%;
  }

  #about {
    margin-top: 4rem;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
  }
}
</style>
