#build stage
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

COPY . .
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

#run stage
FROM eclipse-temurin:17-jre
WORKDIR /app

#Copying the jar that Maven built
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
