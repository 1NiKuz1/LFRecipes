<template>
  <div v-if="countOfPages > 1" class="pagination">
    <div class="pagination__nav-wrapper">
      <button
        class="pagination__double-arrow"
        :disabled="page == 1"
        @click="handlerSelectedPage(1)"
      ></button>
      <button
        class="pagination__arrow"
        :disabled="page == 1"
        @click="handlerSelectedPage(page - 1)"
      ></button>
    </div>

    <div class="pagination__buttons-wrapper">
      <button
        v-for="numPage in pages"
        :key="numPage"
        :style="numPage == page ? selectedButton : {}"
        @click="handlerSelectedPage(numPage)"
      >
        {{ numPage }}
      </button>
    </div>

    <div class="pagination__nav-wrapper pagination__nav-wrapper--reverse">
      <button
        class="pagination__double-arrow"
        :disabled="page == countOfPages"
        @click="handlerSelectedPage(countOfPages)"
      ></button>
      <button
        class="pagination__arrow"
        :disabled="page == countOfPages"
        @click="handlerSelectedPage(page + 1)"
      ></button>
    </div>
  </div>
</template>

<script>
export default {
  name: "main-pagination",
  props: {
    page: {
      type: Number,
      required: true,
    },
    countOfRecords: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
  },
  emits: ["update:page"],
  data() {
    return {
      selectedButton: {
        backgroundColor: "var(--color-accent)",
        color: "var(--color-white)",
      },
      countOfViewPages: 5,
    };
  },
  computed: {
    countOfPages() {
      return Math.ceil(this.countOfRecords / this.limit);
    },
    maxPage() {
      if (this.page <= this.countOfViewPages) return this.countOfViewPages;
      if (this.page + this.countOfViewPages / 2 >= this.countOfPages)
        return this.countOfPages;
      return (
        this.page + this.countOfViewPages - Math.ceil(this.countOfViewPages / 2)
      );
    },
    pages() {
      const arrOfPages = [];
      for (
        let page = this.maxPage - (this.countOfViewPages - 1);
        page <= this.maxPage;
        ++page
      )
        arrOfPages.push(page);
      return arrOfPages;
    },
  },
  methods: {
    handlerSelectedPage(page) {
      this.$emit("update:page", page);
    },
  },
};
</script>

<style scoped>
.pagination {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}

.pagination__nav-wrapper {
  display: flex;
  gap: 10px;
}

.pagination__arrow,
.pagination__double-arrow {
  height: 21px;
  background-repeat: no-repeat;
  background-position: center;
}

.pagination__arrow {
  width: 12px;
  background-image: url("../assets/arrow-green.svg");
}

.pagination__double-arrow {
  width: 24px;
  background-image: url("../assets/double-arrow-green.svg");
}

.pagination__arrow:disabled {
  background-image: url("../assets/arrow.svg");
}

.pagination__double-arrow:disabled {
  background-image: url("../assets/double-arrow.svg");
}

.pagination__nav-wrapper--reverse {
  transform: rotate(180deg);
}

.pagination__buttons-wrapper {
  display: flex;
  gap: 10px;
}

.pagination__buttons-wrapper button {
  padding: 2px 10px;
  border-radius: 5px;
  font-weight: 700;
}

p {
  margin-bottom: 0;
}
</style>
