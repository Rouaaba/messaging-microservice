# First stage: build the JAR
FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /app
COPY . /app
RUN mvn clean package


FROM openjdk:21-slim
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8090
ENTRYPOINT ["java", "-jar", "/app.jar"]
