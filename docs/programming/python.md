# Python

- [Learn the Basics](#learn-the-basics)
  - [Basic Syntax](#basic-syntax)
  - [Variables & Data Types](#variables-and-data-types)
  - [Conditionals](#conditionals)
  - [Type Casting & Exceptions](#type-casting-and-exceptions)
  - [Functions](#functions)
  - [Data Types](#data-types)
    - [Lists](#lists)
    - [Tuples](#tuples)
    - [Sets](#sets)
    - [Dictionaries](#dictionaries)
- [Data Structures & Algorithms](#data-structures-and-algorithms)
  - [Arrays & Linked Lists](#arrays-and-linked-lists)
  - [Heaps, Stacks & Queues](#heaps-stacks-and-queues)
  - [Hash Tables](#hash-tables)
  - [Binary Search Trees](#binary-search-trees)
  - [Recursion](#recursion)
  - [Sorting Algorithms](#sorting-algorithms)
- [Advanced Topics](#advanced-topics)
  - [RegEx](#regex)
  - [Decorators](#decorators)
  - [Lambdas](#lambdas)
  - [Object-Oriented Programming](#object-oriented-programming)
    - [Classes](#classes)
    - [Inheritance](#inheritance)
    - [Methods, Dunder](#methods-dunder)
  - [Modules](#modules)
    - [Built-in](#built-in)
    - [Custom](#custom)
  - [Package Managers](#package-managers)
    - [PyPi](#pypi)
    - [Pip](#pip)
    - [Conda](#conda)
  - [List Comprehensions](#list-comprehensions)
  - [Generator Expressions](#generator-expressions)
  - [Paradigms](#paradigms)
- [Frameworks](#frameworks)
  - [Synchronous](#synchronous)
    - [Django](#django)
    - [Flask](#flask)
    - [Pyramid](#pyramid)
  - [Asynchronous](#asynchronous)
    - [gevent](#gevent)
    - [aiohttp](#aiohttp)
    - [Tornado](#tornado)
    - [Sonic](#sonic)
  - [FastAPI](#fastapi)
- [Testing Apps](#testing-apps)
  - [doctest](#doctest)
  - [nose](#nose)
  - [pytest](#pytest)
  - [unittest / pyUnit](#unittest-pyunit)

----

# Sequences & Mutability

A **sequence type is a type of data in Python which is able to store more than one value (or less than one, as a sequence may be empty), and these values can be sequentially (hence the name) browsed**, element by element.

There are two kinds of Python data: **mutable** and **immutable**.

**Mutable data can be freely updated at any time** - we call such an operation in situ.

**Immutable data cannot be modified in this way**.

Imagine that a list can only be assigned and read over. You would be able neither to append an element to it, nor remove any element from it. This means that appending an element to the end of the list would require the recreation of the list from scratch.

You would have to build a completely new list, consisting of the all elements of the already existing list, plus the new element.

The data type we want to tell you about now is a **tuple**. **A tuple is an immutable sequence type**. It can behave like a list, but it mustn't be modified in situ.

# 4.6 → Tuples & Dictionaries

## 4.6.1 → Tuples

Tuples are immutable. Their data cannot be changed like it can be done with lists.

### tuple()

This function converts a list to a tuple.

```python
# Converting a list to a tuple
mylist = [1, 2, 3]
print(tuple(mylist))

# Output
(1, 2, 3)
```

Example of Tuples

```python
tuple1 = (1, 2, 3, 4)
typle2 = 1., 2., 3., 4.

print(tuple1)
print(tuple2)

# Output
(1, 2, 3, 4)
(1., 2., 3., 4.)

# Creating an empty tuple
tuple3 = ()

# Creating a one element tuple
tuple4 = 1., # The ending comma makes it a tuple rather than a normal variable.

# Accessing elements in tuple by indexing
print(tuple1[1])
```

> Each element of a Tuple can be a different type.

One of the most useful tuple properties is their ability to **appear on the left side of the assignment operator**.

```python
t1 = 1, 
t2 = 2, 
t3 = 3,

# Example of tuples on the left side of assignment
t1, t2, t3 = t2, t3, t1
```

> Note: the example presents one more important fact: a **tuple's elements can be variables**, not only literals. Moreover, they can be expressions if they're on the right side of the assignment operator.

## 4.6.2 → Dictionaries

A dictionary is a set of **key-value** pairs.

- each key must be **unique** - it's not possible to have more than one key of the same value;
- a key may be **any immutable type of object**: it can be a number (integer or float), or even a string, but not a list;
- a dictionary is not a list - a list contains a set of numbered values, while a **dictionary holds pairs of values**;
- the `len()` function works for dictionaries, too - it returns the numbers of key-value elements in the dictionary;
- a dictionary is a **one-way tool** - if you have an English-French dictionary, you can look for French equivalents of English terms, but not vice versa.

```python
# Dictionary example in Python

dictionary = {"cat": "chat", "dog": "chien", "horse": "cheval"}
phone_numbers = {'boss': 5551234567, 'Suzy': 22657854310}

# Creating an empty dictionary
empty_dictionary = {}

# Using hanging indents for better readability
dictionary = {
	"cat": "chat",
	"dog": "chien",
	"horse": "cheval"
	}
```

### How to use a dictionary?

```python
# Print a dictionary
print(dictionary)
print(phone_numbers)
print(empty_dictionary)

# Use a keyword to get a value
print(dictionary['cat'])
print(phone_numbers['boss']
```

### get()

This method accepts a key to return a value associated with it.

```python
# Getting a value from a key using the get() method
item1 = dictionary.get('cat')
```

### `keys()`

The method **returns an iterable object consisting of all the keys gathered within the dictionary**. Having a group of keys enables you to access the whole dictionary in an easy and handy way.

```python
# Make an iterable list of keys from a dictionary
for key in dictionary.keys():
	print(key)
```

### `sorted()`

This function will return the list sorted.

```python
# Make a sorted, iterable list of keys from a dictionary
for key in sorted(dictionary.keys()):
	print(key)
```

### `items()`

This function returns a tuple of all dictionary elements as a key-value pair.

```python
# Getting a tuple of all dictionary elements
print(dictionary.items())

# Output
dict_items([('cat', 'chat'), ('dog', 'chien'), ('horse', 'cheval')])

# Using tuples to iterate through a dictionary
for english, french in dictionary.items():
	print(english, "->", french)

# Output
cat -> chat
dog -> chien
horse -> cheval
```

### `values()`

This function returns all the values inside a dictionary.

```python
print(dictionary.values())

# Output
dict_values(['chat', 'chien', 'cheval'])

# Getting list of values from a dictionary using a <for> loop
for value in dictionary.values():
	print(value)

# Output
chat
chien
cheval
```

### Replacing a value

Dictionaries are fully mutable so replacing any value for a key is very easy.

```python
# Replacing value of a key in a dictionary
dictionary['cat'] = "minou"
print(dictionary['cat']

# Output
minou # instead of 'chat'
```

### Adding a key

To add a key, it has to be unique and previously non-existent

```python
# Adding a new key to a dictionary
dictionary['swan'] = "cygne"
print(dictionary)

# Output
{'cat': 'chat', 'dog': 'chien', 'horse': 'cheval', 'swan': 'cygne'}
```

### `update()`

The update() method can also be used to add new keys to a dictionary

```python
# Updating a dictionary with a new key
dictionary.update({'duck': 'canard'}) # Update is done using curly brackets
```

### Removing a key

This is done using del as in lists. This will also remove the associated value

```python
# Removing a key from a dictionary
del dictionary['cat']
```

### `popitem()`

This method removes the last element from a dictionary from Python 3.6.7 upwards. Before this version, it will remove a random element.

```python
# Removing the last item from a dictionary
dictionary.popitem()
```

# 4.7 → Exceptions & Errors

## Try - Except

This is a special way of writing code in Python in which the code in the Try part, if it causes an exception, the code in the Except part will be executed instead.

```python
# Example of Try - Except
Try:
	n = int(input("Enter a natural number: ")
	print('The reciprocal of ', n, 'is ', 1 / n)
Except:
	# If the user enters 0 or a letter as an input
	print('This was not intended. We have reached a dark place. Bye!')

# Except statements with exceptions specified
Try:
	n = int(input("Enter a natural number: ")
	print('The reciprocal of ', n, 'is ', 1 / n)
Except ZeroDivisionError:
	# If the user enters 0
	print('So you want to divide by 0? Not here chad!')
Except ValueError:
	# If the user enters a string
	print('Sorry I was expecting something else here!')
Except:
	# Note, the default except statement must always be last
	print('Something strange happened. Quitting!')
```

## ZeroDivisionError

This appears when you try to force Python to perform any operation which provokes division in which the divider is zero, or is indistinguishable from zero.

## Value Error

Expect this exception when you're dealing with values which may be inappropriately used in some context. In general, this exception is raised when a function (like `int()` or `float()`) receives an argument of a proper type, but its value is unacceptable.

## TypeError

This exception shows up when you try to apply a data whose type cannot be accepted in the current context.

```python
# Example of TypeError
mylist = [1]
print(mylist[0.5]) # Float cannot be used a list index.
```

## AttributeError

This exception arrives – among other occasions – when you try to activate a method which doesn't exist in an item you're dealing with.

```python
# Example of AttributeError
mytuple = 1, 2, 3, 4
mytuple1 = mytuple.append(5) # append() is not a valid method for tuples.
```

## SyntaxError

This exception is raised when the control reaches a line of code which violates Python's grammar. This error should not be handled and instead, should be avoided by writing good code.