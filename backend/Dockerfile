# --- BUILD STAGE ---
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy src and compile
COPY src ./src
RUN mvn package -DskipTests -B

# --- RUNTIME STAGE ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Add a non-root group and user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy built jar from builder
COPY --from=builder /app/target/saas-backend-*.jar app.jar

# Expose backend port
EXPOSE 8080

# Configure JVM properties for container scalability and logging
ENTRYPOINT ["java", "-XX:+UseParallelGC", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
