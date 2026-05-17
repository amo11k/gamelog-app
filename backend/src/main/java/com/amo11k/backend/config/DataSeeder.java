package com.amo11k.backend.config;

import com.amo11k.backend.entity.Game;
import com.amo11k.backend.entity.User;
import com.amo11k.backend.entity.UserGame;
import com.amo11k.backend.entity.enums.GameStatus;
import com.amo11k.backend.repository.GameRepository;
import com.amo11k.backend.repository.UserGameRepository;
import com.amo11k.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final UserGameRepository userGameRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded, skipping...");
            return;
        }

        log.info("Seeding database with example data...");

        User alice = userRepository.save(User.builder()
                .username("alice")
                .email("alice@example.com")
                .password(passwordEncoder.encode("password123"))
                .bio("JRPG enthusiast and completionist. I love stories that make me cry.")
                .build());

        User bob = userRepository.save(User.builder()
                .username("bob")
                .email("bob@example.com")
                .password(passwordEncoder.encode("password123"))
                .bio("FPS gamer and speedrunner. Currently chasing world records.")
                .build());

        User charlie = userRepository.save(User.builder()
                .username("charlie")
                .email("charlie@example.com")
                .password(passwordEncoder.encode("password123"))
                .bio("Indie game lover and game dev. Playing for inspiration.")
                .build());

        Game cyberpunk = gameRepository.save(Game.builder()
                .externalId("3328")
                .title("Cyberpunk 2077")
                .coverUrl("https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg")
                .releaseDate("2020-12-10")
                .genres("Action, RPG, Sci-Fi")
                .platforms("PC, PlayStation, Xbox")
                .build());

        Game eldenRing = gameRepository.save(Game.builder()
                .externalId("326243")
                .title("Elden Ring")
                .coverUrl("https://media.rawg.io/media/games/5ec/5ecac5cb7ecf26f59d1e30a1510c1c00.jpg")
                .releaseDate("2022-02-25")
                .genres("Action, RPG, Dark Fantasy")
                .platforms("PC, PlayStation, Xbox")
                .build());

        Game hollowKnight = gameRepository.save(Game.builder()
                .externalId("9767")
                .title("Hollow Knight")
                .coverUrl("https://media.rawg.io/media/games/4cf/4cfc6b7f1850590a4634b08bfab308ab.jpg")
                .releaseDate("2017-02-24")
                .genres("Metroidvania, Action, Platformer")
                .platforms("PC, Nintendo Switch, PlayStation")
                .build());

        Game bg3 = gameRepository.save(Game.builder()
                .externalId("3498")
                .title("Baldur's Gate 3")
                .coverUrl("https://media.rawg.io/media/games/21a/21ad672a2b29a48c93f28f43e0a2b70d.jpg")
                .releaseDate("2023-08-03")
                .genres("RPG, Strategy, Fantasy")
                .platforms("PC, PlayStation, Xbox")
                .build());

        Game stardew = gameRepository.save(Game.builder()
                .externalId("654")
                .title("Stardew Valley")
                .coverUrl("https://media.rawg.io/media/games/713/713dad986bc0f66e7235b0aade1fa55f.jpg")
                .releaseDate("2016-02-26")
                .genres("Simulation, RPG, Indie")
                .platforms("PC, Nintendo Switch, Mobile")
                .build());

        userGameRepository.save(UserGame.builder()
                .user(alice).game(eldenRing).status(GameStatus.COMPLETED)
                .rating(95).hoursPlayed(180.0)
                .review("Masterpiece. The sense of discovery is unmatched.")
                .build());

        userGameRepository.save(UserGame.builder()
                .user(alice).game(cyberpunk).status(GameStatus.COMPLETED)
                .rating(85).hoursPlayed(120.0)
                .review("Amazing story, great atmosphere despite the rough launch.")
                .build());

        userGameRepository.save(UserGame.builder()
                .user(alice).game(hollowKnight).status(GameStatus.PLAYING)
                .rating(90).hoursPlayed(45.0)
                .review("The art style is gorgeous. Exploration is top-notch.")
                .build());

        userGameRepository.save(UserGame.builder()
                .user(bob).game(cyberpunk).status(GameStatus.COMPLETED)
                .rating(78).hoursPlayed(90.0)
                .review("Solid game, great gunplay and customization.")
                .build());

        userGameRepository.save(UserGame.builder()
                .user(bob).game(bg3).status(GameStatus.PLAYING)
                .rating(92).hoursPlayed(200.0)
                .review("The sheer amount of choices is incredible.")
                .build());

        userGameRepository.save(UserGame.builder()
                .user(bob).game(stardew).status(GameStatus.DROPPED)
                .rating(70).hoursPlayed(10.0)
                .review("Too chill for me, but I get the appeal.")
                .build());

        userGameRepository.save(UserGame.builder()
                .user(charlie).game(hollowKnight).status(GameStatus.COMPLETED)
                .rating(98).hoursPlayed(65.0)
                .review("A perfect game. Every frame is art.")
                .build());

        userGameRepository.save(UserGame.builder()
                .user(charlie).game(stardew).status(GameStatus.COMPLETED)
                .rating(88).hoursPlayed(300.0)
                .review("Most relaxing game ever. 300 hours well spent.")
                .build());

        userGameRepository.save(UserGame.builder()
                .user(charlie).game(eldenRing).status(GameStatus.WISHLIST)
                .rating(0).hoursPlayed(0.0)
                .review("Waiting for a good sale!")
                .build());

        log.info("Seeded {} users, {} games, {} user-game entries",
                userRepository.count(), gameRepository.count(), userGameRepository.count());
    }
}
