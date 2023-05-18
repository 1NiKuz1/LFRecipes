<template>
  <section class="home">
    <div class="container">
      <h1>Найдём рецепты по вкусу</h1>
      <p class="desc">
        Этот сервис создан людьми для людей. Ищите интересующие вас рецепты и
        добавляйте собственные.
      </p>

      <div class="info-cards">
        <div class="info-cards__item">
          <div class="info-cards__content-wrapper">
            <div class="info-cards__content">
              <h3>Использование</h3>
              <p>
                Для просмотра рецептов вы можете перейти в соответствующий
                раздел, но для того чтобы добавлять свои рецепты необходимо
                будет авторизоваться.
              </p>
            </div>
          </div>
          <div class="info-cards__img-wrapper">
            <img
              src="../assets/images/laptop-g1640dd2ab_1920.jpg"
              alt="Img"
              class="info-cards__img"
            />
          </div>
        </div>

        <div class="info-cards__item info-cards__item--reverse">
          <div class="info-cards__img-wrapper">
            <img
              src="../assets/images/cook-g4dd0863a0_1920.jpg"
              alt="Img"
              class="info-cards__img"
            />
          </div>
          <div class="info-cards__content-wrapper">
            <div class="info-cards__content">
              <h3>Рецепты</h3>
              <p>
                Выбирайте рецепты по интересующим категориям. У вас полная
                свобода действий во время добавления рецептуры. Делитись
                рецептами в социальных сетях.
              </p>
            </div>
          </div>
        </div>

        <div class="info-cards__item">
          <div class="info-cards__content-wrapper">
            <div class="info-cards__content">
              <h3>Заключение</h3>
              <p>
                Упростим себе поиск рецептов и поможем друг другу упростить себе
                жизнь создав для себя удобную среду где можно найти чем вкусно
                покушать.
              </p>
            </div>
          </div>
          <div class="info-cards__img-wrapper">
            <img
              src="../assets/images/board-g380da3ded_1920.jpg"
              alt="Img"
              class="info-cards__img"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script></script>

<style scoped>
.home {
  position: relative;
}

.home .info-cards {
  margin-top: 90px;
  margin-bottom: 150px;
}

.info-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 80px;
}
.info-cards__item {
  display: flex;
  width: 100%;
  padding: 0 20px;
}

.info-cards__content-wrapper {
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  align-items: center;
}
.info-cards__img-wrapper {
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
}
.info-cards__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 400px;
}

.info-cards__content p {
  margin-bottom: 25px;
}
.info-cards__img {
  height: 210px;
  width: 400px;
  border-radius: 30px;
}

.info-cards__item--reverse .info-cards__img-wrapper {
  justify-content: start;
}

@media (max-width: 991px) {
  .info-cards__item {
    flex-wrap: wrap;
    justify-content: center;
  }

  .info-cards__content-wrapper {
    order: 2;
  }
  .info-cards__img-wrapper {
    order: 1;
    margin-bottom: 30px;
  }

  .info-cards__item--reverse .info-cards__content-wrapper {
    order: 2;
  }

  .info-cards__item--reverse .info-cards__img-wrapper {
    order: 1;
  }
}

@media (max-width: 480px) {
  .info-cards__img {
    height: auto;
    width: 100%;
  }

  .desc {
    font-size: 18px;
  }
}
</style>
