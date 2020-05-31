using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryService.Inventory;
using Microsoft.EntityFrameworkCore;

namespace InventoryService
{
    public class DatabaseInitializer
    {
        public static async Task Initialize(ProductContext context)
        {
            while (true)
            {
                Console.WriteLine("Waiting for DB");

                try
                {
                    await context.Database.MigrateAsync();

                    if (!context.Products.Any())
                    {
                        var products = new List<Product>
                        {
                            new Product { Id = "APL7", Name = "iPhone 7", ImageSrc = "https://assets.swappie.com/iPhone732GBMattaMusta-1-2-300x300.jpg", Price = 10, Quantity = 2 },
                            new Product { Id = "APL8", Name = "iPhone 8", ImageSrc = "https://assets.swappie.com/SwappieiPhone864GBhopeaI-1-1-300x300.jpg", Price = 20, Quantity = 0 },
                            new Product { Id = "APLX", Name = "iPhone X", ImageSrc = "https://assets.swappie.com/SwappieiPhonex256gbt%C3%A4htiharmaa-1-1-1-300x300.jpg", Price = 30, Quantity = 4 },
                            new Product { Id = "APL11", Name = "iPhone 11", ImageSrc = "https://assets.swappie.com/iphone11violetti-300x300.jpg", Price = 40, Quantity = 1 }
                        };

                        await context.Products.AddRangeAsync(products);
                        await context.SaveChangesAsync();
                    }

                    return;
                }
                catch (Exception) { }

                await Task.Delay(1000);
            }
        }
    }
}