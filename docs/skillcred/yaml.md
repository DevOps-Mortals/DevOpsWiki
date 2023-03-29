# YAML

### Highlights

- Features are derived from multiple languages like Perl, HTML, C, MIME etc.
- File extensions can be either .yml or .yaml
- YAML Files are case-sensitive.
- A single YAML file can contain multiple documents.
- Documents are separated using three hyphens (- - -) and three dots (. . .) Dots are optional.
- YAML supports comments using #
- Comments can be inline or multiline.

```yaml
key1: value1 #My first value
# My second value below
key2: value2
```

- Clean Syntax

  - Relies entirely on indentations
  - Nesting and structured data (including lists)

  ```yaml
  key1: value1 # Level 1
  key2: value2
  key3: value3 # Level 1
  	test1: mytest1 # Level 2
  	test2: mytest2
  		testkey1: mytestkey1 # Level 3
  		testkey2:
  			- testkey2a
  			- testkey2b # List
  ```

- YAML does not allow tabs. It uses spaces. 2 spaces.

- Precise Feedback. It shows a specific line in the file where there is an error.

- Supports complex data structures including referring to other data objects and supporting recursive and nested data.

- Explicit data types using tags. YAML detects data-types automatically based on the value provided. But data types can also be specified using “!!” symbol.

- Does not have any executable commands. It is only a data representation format. This is why they are very secure. It needs other tools to execute.

- YAML is a superset of JSON. This means JSON  format is readable inside YAML files.

## Basic Rules & Syntax

Structure of a YAML file is a Map or a List

- Colon and a single space define a scalar or a variable

```yaml
string: "17"
integer: 17
boolean: no
```

- “|” can create multiple line strings (new lines) and “>” wraps strings into paragraphs.

```yaml
data: |
	Every one
	of these
	newlines
	will be
	broken up
```

Output:

Every one

of these

newlines

will be

broken up

```yaml
data: >
	Every one of these lines is wrapped into a paragraph
	using this greater than symbol and 
	works it's magic when you run out of page width.
```

Output:

Every one of these lines is wrapped into a paragraph using this greater than symbol and works it’s magic when you run out of page width.

- When making a list, the data type should be the same, the data can be different.

## YAML Data Types

- Scalar

  - Numeric
    - integer
    - decimal, octal, hexadecimal
    - floating point
    - booleans
  - String

- Lists

  - Hash (#)
  - Dash (-)
  - Items separated by comma within brackets [1, 2, 3]

- Dictionary

  - Store complex data types.

    ```yaml
    ---
    - Developer 1:
    		empname: John
    		Skills:
    			- Python
    			- Java
    ```

## Sequence & Mapping

4 Types of Mapping

### Simple Mapping

Just simple key-value pairs

### Sequence Mapping

Same data style inside a parent.

### Nested Mapping

Data-types inside a key-value pair

### Mixed Mapping

Different data types

```yaml
#this is a simple map
name: John

# This is a nested map
name: John
	parents:
		fathername: Simon
		mothername: Elene

# This is a sequence map
name: John
age: 34
address:
	street: 1 John's Way

# This is a mixed map
name: John
skills:
	- Python
	- Java
```