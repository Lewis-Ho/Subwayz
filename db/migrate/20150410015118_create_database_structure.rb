class CreateDatabaseStructure < ActiveRecord::Migration
  def change
#    create_table :database_structures do |t|



ActiveRecord::Schema.define(version: 0) do

  create_table :calendars,id: false, force: :cascade do |t|

    t.string :service_id, limit: 30, null: false
    t.string :monday,     limit: 4
    t.string :tuesday,    limit: 4
    t.string :wednesday,  limit: 4
    t.string :thursday,   limit: 4
    t.string :friday,     limit: 4
    t.string :saturday,   limit: 4
    t.string :sunday,     limit: 4
    t.string :start_date, limit: 30
    t.string :end_date,   limit: 30
  end

  create_table :routes,id: false, force: :cascade do |t|
    t.string :route_id, limit: 20, null: false
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

  create_table :stops, id: false, force: :cascade do |t|
    t.string :stop_id, limit: 20, null: false
    t.string "stop_code",      limit: 20
    t.string "stop_name",      limit: 100
    t.string "stop_lat",       limit: 200
    t.string "stop_lon",       limit: 200
    t.string "zone_id",        limit: 200
    t.string "location_type",  limit: 10
    t.string "parent_station", limit: 10
  end

  create_table :trips, id: false, force: :cascade do |t|
    t.string "trip_id",      limit: 40, null: false
    t.string "route_id",      limit: 20, null: false
    t.string "service_id",    limit: 30, null: false
    t.string "trip_headsign", limit: 40
    t.string "direction_id",  limit: 40
    t.string "block_id",      limit: 40
    t.string "shape_id",      limit: 40
  end


  create_table "stop_times", force: :cascade do |t|
    t.string "trip_id",             limit: 40, null: false
    t.string "arrival_time",        limit: 40
    t.string "departure_time",      limit: 40
    t.string "stop_id",             limit: 20, null: false
    t.integer "stop_sequence" 
    t.string "pickup_type",         limit: 40
    t.string "drop_off_type",       limit: 40
    t.integer "arrival_time_min"
  end


  create_table "votes", force: :cascade do |t|
    t.belongs_to :stop_time, index: true
    t.datetime "d_t",         limit: 6
    t.string  "day",          limit: 40
    t.integer "vote"
  end


  add_index :calendars,:service_id, unique: true
  add_index :routes,:route_id, unique: true
  add_index :stops, :stop_id, unique: true
  add_index :trips,:trip_id, unique: true
  add_index "stop_times", ["stop_id"], name: "stop_id", using: :btree
  add_index "stop_times", ["trip_id"], name: "trip_id", using: :btree
 
  add_index "trips", ["route_id"], name: "route_id", using: :btree
  add_index "trips", ["service_id"], name: "service_id", using: :btree


 add_foreign_key :stop_times, :stops, column: :stop_id, primary_key: "stop_id"
  add_foreign_key :stop_times, :trips, column: :trip_id, primary_key: "trip_id"
  add_foreign_key :trips, :calendars, column: :service_id, primary_key: "service_id"
 add_foreign_key :trips, :routes, column: :route_id, primary_key: "route_id"
 add_foreign_key :votes, :stop_times, column: :id, primary_key: "id" 


end




    end
  end
#end
