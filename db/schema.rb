# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150507180551) do

  create_table "about_us", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "calendars", primary_key: "service_id", force: :cascade do |t|
    t.string "monday",     limit: 4
    t.string "tuesday",    limit: 4
    t.string "wednesday",  limit: 4
    t.string "thursday",   limit: 4
    t.string "friday",     limit: 4
    t.string "saturday",   limit: 4
    t.string "sunday",     limit: 4
    t.string "start_date", limit: 30
    t.string "end_date",   limit: 30
  end

  create_table "routes", primary_key: "route_id", force: :cascade do |t|
    t.string "agency_id",        limit: 20
    t.string "route_short_name", limit: 100
    t.string "route_long_name",  limit: 100
    t.string "route_type",       limit: 100
    t.string "route_color",      limit: 100
    t.string "route_text_color", limit: 50
  end

  create_table "shapes", id: false, force: :cascade do |t|
    t.string "shape_id",            limit: 40
    t.string "shape_pt_lat",        limit: 40
    t.string "shape_pt_lon",        limit: 40
    t.string "shape_pt_sequence",   limit: 40
    t.string "shape_dist_traveled", limit: 40
  end

  create_table "stop_times", force: :cascade do |t|
    t.string  "trip_id",          limit: 40, null: false
    t.string  "arrival_time",     limit: 40
    t.string  "departure_time",   limit: 40
    t.string  "stop_id",          limit: 20, null: false
    t.integer "stop_sequence",    limit: 4
    t.string  "pickup_type",      limit: 40
    t.string  "drop_off_type",    limit: 40
    t.integer "arrival_time_min", limit: 4
  end

  add_index "stop_times", ["stop_id"], name: "stop_id", using: :btree
  add_index "stop_times", ["trip_id"], name: "trip_id", using: :btree

  create_table "stops", primary_key: "stop_id", force: :cascade do |t|
    t.string "stop_code",      limit: 20
    t.string "stop_name",      limit: 100
    t.string "stop_lat",       limit: 200
    t.string "stop_lon",       limit: 200
    t.string "zone_id",        limit: 200
    t.string "location_type",  limit: 10
    t.string "parent_station", limit: 10
  end

  create_table "trips", primary_key: "trip_id", force: :cascade do |t|
    t.string "route_id",      limit: 20, null: false
    t.string "service_id",    limit: 30, null: false
    t.string "trip_headsign", limit: 40
    t.string "direction_id",  limit: 40
    t.string "block_id",      limit: 40
    t.string "shape_id",      limit: 40
  end

  add_index "trips", ["route_id"], name: "route_id", using: :btree
  add_index "trips", ["service_id"], name: "service_id", using: :btree

  create_table "votes", force: :cascade do |t|
    t.integer  "stop_time_id", limit: 4
    t.datetime "d_t",          limit: 6
    t.string   "day",          limit: 40
    t.integer  "vote",         limit: 4
  end

  add_index "votes", ["stop_time_id"], name: "index_votes_on_stop_time_id", using: :btree

  add_foreign_key "stop_times", "stops", primary_key: "stop_id", name: "stop_times_ibfk_2"
  add_foreign_key "stop_times", "trips", primary_key: "trip_id", name: "stop_times_ibfk_1"
  add_foreign_key "trips", "calendars", column: "service_id", primary_key: "service_id", name: "trips_ibfk_2"
  add_foreign_key "trips", "routes", primary_key: "route_id", name: "trips_ibfk_1"
  add_foreign_key "votes", "stop_times", column: "id"
end
