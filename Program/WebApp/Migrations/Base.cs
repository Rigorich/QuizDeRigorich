using FluentMigrator;

namespace IAFCore.Persistence.Migrations;

[Migration(1)]
public class BaseMigration : Migration
{
    public override void Up()
    {
        Execute.Sql(@"

    CREATE TABLE [dbo].[Users] (
        [Id]              INT              IDENTITY (1, 1) NOT NULL,
        [Nickname]        NVARCHAR (MAX)   NOT NULL,
        [PasswordHash]    NVARCHAR (MAX)   NOT NULL,
        [Token]           UNIQUEIDENTIFIER NULL,
        [TokenExpiration] DATETIME2 (7)    NULL
    );

    GO
    ALTER TABLE [dbo].[Users]
        ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC);

        ");

        Execute.Sql(@"

    CREATE TABLE [dbo].[Quizzes] (
        [Id]     INT            IDENTITY (1, 1) NOT NULL,
        [Title]  NVARCHAR (MAX) NOT NULL,
        [UserId] INT            NOT NULL
    );

    GO
    CREATE NONCLUSTERED INDEX [IX_Quizzes_UserId]
        ON [dbo].[Quizzes]([UserId] ASC);

    GO
    ALTER TABLE [dbo].[Quizzes]
        ADD CONSTRAINT [PK_Quizzes] PRIMARY KEY CLUSTERED ([Id] ASC);

    GO
    ALTER TABLE [dbo].[Quizzes]
        ADD CONSTRAINT [FK_Quizzes_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE;

        ");

        Execute.Sql(@"

    CREATE TABLE [dbo].[Questions] (
        [Id]                 INT            IDENTITY (1, 1) NOT NULL,
        [QuizId]             INT            NOT NULL,
        [Type]               INT            NOT NULL,
        [Priority]           INT            NOT NULL,
        [TimeLimitInSeconds] INT            NOT NULL,
        [Text]               NVARCHAR (MAX) NULL,
        [Image]              NVARCHAR (MAX) NULL
    );

    GO
    CREATE NONCLUSTERED INDEX [IX_Questions_QuizId]
        ON [dbo].[Questions]([QuizId] ASC);

    GO
    ALTER TABLE [dbo].[Questions]
        ADD CONSTRAINT [PK_Questions] PRIMARY KEY CLUSTERED ([Id] ASC);

    GO
    ALTER TABLE [dbo].[Questions]
        ADD CONSTRAINT [FK_Questions_Quizzes_QuizId] FOREIGN KEY ([QuizId]) REFERENCES [dbo].[Quizzes] ([Id]) ON DELETE CASCADE;

        ");

        Execute.Sql(@"

    CREATE TABLE [dbo].[Answers] (
        [Id]         INT            IDENTITY (1, 1) NOT NULL,
        [QuestionId] INT            NOT NULL,
        [Priority]   INT            NOT NULL,
        [Text]       NVARCHAR (MAX) NULL,
        [Image]      NVARCHAR (MAX) NULL,
        [IsRight]    BIT            NOT NULL
    );


    GO
    CREATE NONCLUSTERED INDEX [IX_Answers_QuestionId]
        ON [dbo].[Answers]([QuestionId] ASC);


    GO
    ALTER TABLE [dbo].[Answers]
        ADD CONSTRAINT [PK_Answers] PRIMARY KEY CLUSTERED ([Id] ASC);


    GO
    ALTER TABLE [dbo].[Answers]
        ADD CONSTRAINT [FK_Answers_Questions_QuestionId] FOREIGN KEY ([QuestionId]) REFERENCES [dbo].[Questions] ([Id]) ON DELETE CASCADE;

        ");
    }
    public override void Down()
    {
        throw new NotImplementedException();
    }
}
