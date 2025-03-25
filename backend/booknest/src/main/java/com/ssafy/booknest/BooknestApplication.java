package com.ssafy.booknest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class BooknestApplication {

	public static void main(String[] args) {
		SpringApplication.run(BooknestApplication.class, args);
	}

}
