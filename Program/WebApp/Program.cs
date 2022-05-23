using FluentMigrator.Runner;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Converters;
using System.Reflection;
using WebApp.Data;
using WebApp.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder => builder
        .SetIsOriginAllowed(_ => true)
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});

builder.Services.AddHttpContextAccessor();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContextFactory<ApplicationDbContext>(options => options.UseSqlServer(connectionString));

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddSignalR();

builder.Services.AddRazorPages();

builder.Services.AddControllers()
    .AddNewtonsoftJson(opts =>
    {
        opts.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.Indented;
        opts.SerializerSettings.Converters.Add(new StringEnumConverter());
    });

builder.Services.AddSwaggerGen();

builder.Services
    .AddFluentMigratorCore()
    .ConfigureRunner(rb => rb
        .AddSqlServer()
        .WithGlobalConnectionString(builder.Configuration.GetConnectionString("DefaultConnection"))
        .ScanIn(Assembly.GetExecutingAssembly()).For.Migrations());

WebApp.Migrations.Runner.Run(builder.Services);

var app = builder.Build();

app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

//app.UseHttpsRedirection();
app.UseFileServer();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(opts =>
{
    opts.MapRazorPages();
    opts.MapControllers();
    opts.MapHub<QuizHub>("/quiz");
});

app.UseSwagger();
app.UseSwaggerUI();

app.Run();
