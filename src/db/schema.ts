import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, time, timestamp, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
});

export const studiosTable = pgTable("studios", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),

});

export const usersToStudiosTable = pgTable("users_to_studios", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => usersTable.id),
    studioId: uuid("studio_id").notNull().references(() => studiosTable.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const usersToStudiosTableRelations = relations(usersToStudiosTable, ({ one }) => ({
    users: one(usersTable, {
        fields: [usersToStudiosTable.userId],
        references: [usersTable.id],
    }),
    studios: one(studiosTable, {
        fields: [usersToStudiosTable.studioId],
        references: [studiosTable.id],
    }),
}));

export const studiosTableRelations = relations(studiosTable, ({ many }) => ({
    artists: many(artistsTable),
    customers: many(customersTable),
    appointments: many(appointmentsTable),
    usersToStudios: many(usersToStudiosTable),
}));

export const artistsTable = pgTable("artists", {
    id: uuid("id").defaultRandom().primaryKey(),
    studioId: uuid("studio_id").notNull().references(() => studiosTable.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    avatarImageUrl: text("avatar_image_url"),
    // 1 Monday, 2 Tuesday, ..., 7 Sunday
    avaliableFromWeekday: integer("avaliable_from_weekday").notNull(), // 1
    avaliableToWeekday: integer("avaliable_to_weekday").notNull(), // 5
    avaliableFromTime: time("avaliable_from_time").notNull(), // 09:00
    avaliableToTime: time("avaliable_to_time").notNull(), // 18:00
    speciality: text("specialty").notNull(),
    appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const artistsTableRelations = relations(artistsTable, ({ one }) => ({
    studios: one(studiosTable, {
        fields: [artistsTable.studioId],
        references: [studiosTable.id],
    }),
}));

// enum
export const customerSexEnum = pgEnum("customer_sex", ["male","female"]);

export const customersTable = pgTable("customers", {
    id: uuid("id").defaultRandom().primaryKey(),
    studioId: uuid("studio_id").notNull().references(() => studiosTable.id,{ onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phoneNumber: text("phone_number").notNull(),
    sex: customerSexEnum("sex").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const customersTableRelations = relations(customersTable, ({ one , many }) => ({
    studios: one(studiosTable, {
        fields: [customersTable.studioId],
        references: [studiosTable.id],
    }),
    appointments: many(appointmentsTable),
}));    

export const appointmentsTable = pgTable("appointments", {
    id: uuid("id").defaultRandom().primaryKey(),
    date: timestamp("date").notNull(),
    customerId: uuid("customer_id").notNull().references(() => customersTable.id, { onDelete: "cascade" }),
    artistId: uuid("artist_id").notNull().references(() => artistsTable.id, { onDelete: "cascade" }),
    studioId: uuid("studio_id").notNull().references(() => studiosTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const appointmentsTableRelations = relations(appointmentsTable, ({ one }) => ({
    customers: one(customersTable, {
        fields: [appointmentsTable.customerId],
        references: [customersTable.id],
    }),
    artists: one(artistsTable, {
        fields: [appointmentsTable.artistId],
        references: [artistsTable.id],
    }),
    studios: one(studiosTable, {
        fields: [appointmentsTable.studioId],
        references: [studiosTable.id],
    }),
})); 