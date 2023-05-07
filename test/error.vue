<style lang="scss">
@unocss all;

@unknown test;

@screen xs {
  .grid {
    @apply grid-cols-1;
  }
}

@mixin testTOTO {
  content: rgb(0 0 0);
}

.fooFOO {
  @include testTOTO;

  content: test;
}

.bar {
}

.bar2 {
  toto: tata;
}
</style>
