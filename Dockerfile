# Используем официальный образ OpenJDK 17
FROM openjdk:17

# Создаем рабочую директорию /app
WORKDIR /app

# Копируем JAR-файл из target/ в контейнер
COPY target/spring-boot_security-bootstrap-REST-0.0.1-SNAPSHOT.jar app.jar

# Запускаем приложение
CMD ["java", "-jar", "app.jar"]

# Переопределяем адрес БД, чтобы приложение нашло её изнутри контейнера (используем host.docker.internal)
ENV SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/my_db

#В конфигурации Dockerfile (инструментами IDEA) ОБЯЗАТЕЛЬНО указать порт 8080:8080, иначе в бразуере приложение не откроется