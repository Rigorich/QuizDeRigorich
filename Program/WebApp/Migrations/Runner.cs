using FluentMigrator.Runner;
using Microsoft.EntityFrameworkCore;
using WebApp.Data;

namespace WebApp.Migrations;

public class Runner
{
    public static void Run(IServiceCollection services)
    {
        using (var sp = services.BuildServiceProvider())
        {
            using var scope = sp.CreateScope();
            var scopedServices = scope.ServiceProvider;

            var dbContextFactory = scopedServices.GetRequiredService<IDbContextFactory<ApplicationDbContext>>();
            using (var db = dbContextFactory!.CreateDbContext())
            {
                db.Database.OpenConnection();
                db.Database.CloseConnection();
            }

            var migrationRunner = scopedServices.GetRequiredService<IMigrationRunner>();
            migrationRunner.MigrateUp();
        }
    }
}
