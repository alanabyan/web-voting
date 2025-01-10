import fs from "fs";
import csv from "csv-parser";
import bcrypt from "bcrypt";
import prisma from "./src/libs/prisma";

const importUsers = async (csvFilePath: string) => {
    const users : {
        nis : string,
        kelas? : string,
        name : string,
        password : string,
        role? : "ADMIN" | "USER"
    }[] = []

    fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      users.push({
        nis: row.nis,
        kelas: row.kelas || "",
        name: row.name,
        password: row.password,
        role: row.role === "ADMIN" ? "ADMIN" : "USER",
      });
    })
    .on("end", async () => {
      console.log("CSV file successfully processed");

      try {
        for (const user of users) {
          const hashedPassword = await bcrypt.hash(user.password, 10); 

          await prisma.user.create({
            data: {
              nis: user.nis,
              kelas: user.kelas,
              name: user.name,
              password: hashedPassword, 
              role: user.role,
            },
          });
        }
        console.log("All users imported successfully!");
      } catch (error) {
        console.error("Error importing users:", error);
      } finally {
        await prisma.$disconnect();
      }
    });
};

const csvFilePath = "./src/data/users.csv"; 
importUsers(csvFilePath);




