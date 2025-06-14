#!/usr/bin/env python3
"""
CSV to SQL Dump Converter
Reads CSV data and converts it to SQL INSERT statements
"""

import csv
import re
from typing import List, Dict, Any

def clean_string_for_sql(value: str) -> str:
    """Clean string values for SQL insertion by escaping single quotes"""
    if isinstance(value, str):
        return value.replace("'", "''")
    return str(value)

def parse_point_geometry(geometry: str) -> tuple:
    """Parse POINT geometry string to extract longitude and latitude"""
    match = re.match(r'POINT \(([+-]?\d+\.?\d*) ([+-]?\d+\.?\d*)\)', geometry)
    if match:
        longitude = float(match.group(1))
        latitude = float(match.group(2))
        return longitude, latitude
    return None, None

def infer_sql_type(value: Any) -> str:
    """Infer SQL data type from Python value"""
    if value is None or value == '':
        return 'NULL'
    elif isinstance(value, bool):
        return 'BOOLEAN'
    elif isinstance(value, int):
        return 'INTEGER'
    elif isinstance(value, float):
        return 'DECIMAL(10,2)'
    else:
        # Check if it's a POINT geometry
        if isinstance(value, str) and value.startswith('POINT'):
            return 'GEOMETRY'
        return 'VARCHAR(255)'

def generate_create_table_sql(headers: List[str], sample_row: Dict[str, Any], table_name: str) -> str:
    """Generate CREATE TABLE SQL statement"""
    sql_parts = [f"CREATE TABLE {table_name} ("]
    
    column_definitions = []
    for header in headers:
        value = sample_row.get(header, '')
        
        # Special handling for geometry column
        if header == 'geometry':
            column_definitions.append(f"    {header} GEOMETRY")
            column_definitions.append(f"    longitude DECIMAL(10,7)")
            column_definitions.append(f"    latitude DECIMAL(10,7)")
        elif header == 'id':
            column_definitions.append(f"    {header} INTEGER PRIMARY KEY")
        else:
            sql_type = infer_sql_type(value)
            column_definitions.append(f"    {header} {sql_type}")
    
    sql_parts.append(',\n'.join(column_definitions))
    sql_parts.append(");")
    
    return '\n'.join(sql_parts)

def convert_csv_to_sql(csv_file_path: str, output_file_path: str, table_name: str = 'stores'):
    """Convert CSV file to SQL dump"""
    
    try:
        with open(csv_file_path, 'r', encoding='utf-8') as csvfile:
            # Read CSV data
            csv_reader = csv.DictReader(csvfile)
            rows = list(csv_reader)
            
            if not rows:
                print("No data found in CSV file")
                return
            
            headers = csv_reader.fieldnames
            
            # Generate SQL dump
            with open(output_file_path, 'w', encoding='utf-8') as sqlfile:
                # Write header comment
                sqlfile.write(f"-- SQL Dump generated from CSV data\n")
                sqlfile.write(f"-- Table: {table_name}\n")
                sqlfile.write(f"-- Total records: {len(rows)}\n\n")
                
                # Drop table if exists
                sqlfile.write(f"DROP TABLE IF EXISTS {table_name};\n\n")
                
                # Create table
                create_table_sql = generate_create_table_sql(headers, rows[0], table_name)
                sqlfile.write(create_table_sql)
                sqlfile.write("\n\n")
                
                # Insert data
                sqlfile.write(f"INSERT INTO {table_name} (")
                
                # Write column names (including longitude, latitude for geometry)
                insert_columns = []
                for header in headers:
                    if header == 'geometry':
                        insert_columns.extend(['geometry', 'longitude', 'latitude'])
                    else:
                        insert_columns.append(header)
                
                sqlfile.write(", ".join(insert_columns))
                sqlfile.write(") VALUES\n")
                
                # Write data rows
                for i, row in enumerate(rows):
                    values = []
                    
                    for header in headers:
                        value = row[header]
                        
                        if header == 'geometry':
                            # Handle geometry column
                            longitude, latitude = parse_point_geometry(value)
                            geometry_sql = f"ST_GeomFromText('{clean_string_for_sql(value)}')"
                            values.append(geometry_sql)
                            values.append(str(longitude) if longitude is not None else 'NULL')
                            values.append(str(latitude) if latitude is not None else 'NULL')
                        elif value == '' or value is None:
                            values.append('NULL')
                        elif header in ['id']:
                            values.append(str(int(float(value))))
                        elif header in ['nps', 'fillfoundrate', 'damage_rate', 'out_of_stock', 'complaint_resolution_time_hrs']:
                            # Numeric columns
                            try:
                                values.append(str(float(value)))
                            except (ValueError, TypeError):
                                values.append('NULL')
                        else:
                            # String columns
                            values.append(f"'{clean_string_for_sql(str(value))}'")
                    
                    # Format the row
                    row_sql = f"({', '.join(values)})"
                    
                    # Add comma except for last row
                    if i < len(rows) - 1:
                        row_sql += ","
                    else:
                        row_sql += ";"
                    
                    sqlfile.write(f"  {row_sql}\n")
                
                # Add indexes for better performance
                sqlfile.write(f"\n-- Create indexes for better performance\n")
                sqlfile.write(f"CREATE INDEX idx_{table_name}_nps ON {table_name}(nps);\n")
                sqlfile.write(f"CREATE INDEX idx_{table_name}_geometry ON {table_name} USING GIST(geometry);\n")
                sqlfile.write(f"CREATE INDEX idx_{table_name}_nombre ON {table_name}(nombre);\n")
                
                print(f"SQL dump successfully created: {output_file_path}")
                print(f"Table name: {table_name}")
                print(f"Records processed: {len(rows)}")
                
    except FileNotFoundError:
        print(f"Error: CSV file '{csv_file_path}' not found")
    except Exception as e:
        print(f"Error processing CSV file: {str(e)}")

def main():
    """Main function to run the converter"""
    # Configuration
    csv_file_path = "../datos_arca/Reto/arca_data.csv"  # Your CSV file
    output_file_path = "stores_dump.sql"  # Output SQL file
    table_name = "stores"  # Table name in database
    
    print("Converting CSV to SQL dump...")
    convert_csv_to_sql(csv_file_path, output_file_path, table_name)

if __name__ == "__main__":
    main()