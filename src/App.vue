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
    <main class="row" id="nationalrat">
      <section class="title row">
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
            <br>
            <span>{{ labels.status[language] }}</span>
            <a href="#about">*</a>
          </p>
          <p>
            {{ labels.intro5[language] }}
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
      </section>
      <section class="row" id="about">
        <div class="col-12">
          <h3>* {{ labels.data[language] }}:</h3>
          <p v-show="language === 'de'">
            Die angezeigten Daten wurden
            über die
            <a href="http://ws-old.parlament.ch" target="_blank">offene Schnittstelle</a>
            von
            <a href="https://www.parlament.ch" target="_blank">parlament.ch</a>
            bezogen (siehe <a href="https://github.com/cyrill-martin/parlament/blob/main/extras/get_councillors.py"
              target="_blank">Script</a>). Daten und Code sind auf
            <a href="https://github.com/cyrill-martin/parlament" target="_blank">GitHub</a>
            verfügbar.
          </p>
          <p v-show="language === 'en'">
            The displayed data was sourced from the
            <a href="http://ws-old.parlament.ch" target="_blank">open interface</a>
            of
            <a href="https://www.parlament.ch" target="_blank">parlament.ch</a>
            using this <a href="https://github.com/cyrill-martin/parlament/blob/main/extras/get_councillors.py"
              target="_blank">script</a>. The data and code are available on
            <a href="https://github.com/cyrill-martin/parlament" target="_blank">GitHub</a>.
          </p>
          <p v-show="language === 'fr'">
            Les données affichées proviennent de
            <a href="http://ws-old.parlament.ch" target="_blank">l'interface ouverte</a>
            de
            <a href="https://www.parlament.ch" target="_blank">parlament.ch</a>
            à l'aide de ce <a href="https://github.com/cyrill-martin/parlament/blob/main/extras/get_councillors.py"
              target="_blank">script</a>. Les données et le code sont disponibles sur
            <a href="https://github.com/cyrill-martin/parlament" target="_blank">GitHub</a>.
          </p>
          <p v-show="language === 'it'">
            I dati mostrati sono stati ottenuti attraverso
            <a href="http://ws-old.parlament.ch" target="_blank">l'interfaccia aperta</a>
            di
            <a href="https://www.parlament.ch" target="_blank">parlament.ch</a>
            utilizzando questo <a href="https://github.com/cyrill-martin/parlament/blob/main/extras/get_councillors.py"
              target="_blank">script</a>. Dati e codice sono disponibili su
            <a href="https://github.com/cyrill-martin/parlament" target="_blank">GitHub</a>.
          </p>
          <p v-show="language === 'rm'">
            Las datas mussadas èn vegnidas retratgadas sur
            <a href="http://ws-old.parlament.ch" target="_blank">l'interfatscha averta</a>
            da
            <a href="https://www.parlament.ch" target="_blank">parlament.ch</a>
            cun quai <a href="https://github.com/cyrill-martin/parlament/blob/main/extras/get_councillors.py"
              target="_blank">script</a>. Datas e code èn disponibels sin
            <a href="https://github.com/cyrill-martin/parlament" target="_blank">GitHub</a>.
          </p>
          <p>
            <br />
            <br />
            Cyrill Martin<br />
            <a href="mailto:cyrill.martin@kmapper.com">cyrill.martin@kmapper.com</a>
          </p>
        </div>
      </section>
    </main>
    <footer class="row">
      <div class="col-12">
        &#169; 2023 <a href="https://kmapper.com" target="_blank">kmapper GmbH</a>
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

#nationalrat {
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

  #nationalrat {
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
