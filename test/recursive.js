import test from 'jtm';
import types, { string, number, object } from 'typea';

test('{ recursive }', t => {

  const category = {
    id: number,
    name: string,
    link: string,
    childs: []
  }

  category.childs.push(...object(category));

  const schema = types(category);

  const sample = {
    id: 1,
    name: "lili",
    link: "https://google.com",
    childs: [
      {
        id: 11,
        name: "lili",
        link: "https://google.com",
        childs: []
      },
      {
        id: 12,
        name: "lili",
        link: "https://google.com",
        childs: [
          {
            id: 121,
            name: "lili",
            link: "https://google.com",
            childs: []
          },
          {
            id: 123,
            name: "lili",
            link: "https://google.com",
            childs: []
          }
        ]
      },
      {
        id: 13,
        name: "lili",
        link: "https://google.com",
        childs: []
      }
    ]
  };

  const { error, data } = schema.verify(sample);

  t.deepEqual(data, sample, error);

});


test('[...recursive]', t => {

  const category = {
    id: number,
    name: string,
    childs: []
  }

  const categorys = [...object(category)];

  category.childs = categorys;

  const schema = types(categorys);

  const sample = [
    {
      id: 1,
      name: "lili",
      childs: [
        {
          id: 12,
          name: "lili",
          childs: []
        },
        {
          id: 13,
          name: "lili",
          childs: [
            {
              id: 14,
              name: "lili",
              childs: [
                {
                  id: 15,
                  name: "lili",
                  childs: []
                },
                {
                  id: 15,
                  name: "lili",
                  childs: []
                }
              ]
            },
            {
              id: 15,
              name: "lili",
              childs: [
                {
                  id: 15,
                  name: "lili",
                  childs: []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "lili",
      childs: [
        {
          id: 21,
          name: "lili",
          childs: []
        },
        {
          id: 21,
          name: "lili",
          childs: []
        },
        {
          id: 21,
          name: "lili",
          childs: []
        }
      ]
    }
  ];

  const { error, data } = schema.verify(sample);

  t.deepEqual(data, sample, error);

});

