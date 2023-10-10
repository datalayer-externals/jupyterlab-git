import { nullTranslator } from '@jupyterlab/translation';
import { shallow } from 'enzyme';
import 'jest';
import * as React from 'react';
import {
  IPastCommitNodeProps,
  PastCommitNode
} from '../../components/PastCommitNode';
import { Git } from '../../tokens';

describe('PastCommitNode', () => {
  const trans = nullTranslator.load('jupyterlab-git');

  const notMatchingBranches: Git.IBranch[] = [
    {
      is_current_branch: false,
      is_remote_branch: false,
      name: 'name1',
      upstream: 'upstream',
      top_commit: 'abcdefghijklmnopqrstuvwxyz01234567890123',
      tag: 'v1.0.4'
    },
    {
      is_current_branch: false,
      is_remote_branch: true,
      name: 'name2',
      upstream: 'upstream',
      top_commit: 'abcdefghijklmnopqrstuvwxyz01234567890123',
      tag: null
    }
  ];
  const matchingBranches: Git.IBranch[] = [
    {
      is_current_branch: false,
      is_remote_branch: false,
      name: 'name3',
      upstream: 'upstream',
      top_commit: '2414721b194453f058079d897d13c4e377f92dc6',
      tag: 'v1.0.4-14-g2414721'
    },
    {
      is_current_branch: false,
      is_remote_branch: true,
      name: 'name4',
      upstream: 'upstream',
      top_commit: '2414721b194453f058079d897d13c4e377f92dc6',
      tag: 'v1.0.5-0-g2414721'
    }
  ];
  const branches: Git.IBranch[] = notMatchingBranches.concat(matchingBranches);
  const matchingTags: Git.ITag[] = [
    {
      name: '1.0.0',
      baseCommitId: '2414721b194453f058079d897d13c4e377f92dc6'
    },
    {
      name: 'feature-1',
      baseCommitId: '2414721b194453f058079d897d13c4e377f92dc6'
    }
  ];
  const notMatchingTags: Git.ITag[] = [
    {
      name: 'feature-2',
      baseCommitId: '798438398'
    },
    {
      name: 'patch-007',
      baseCommitId: '238848848'
    }
  ];
  const tags: Git.ITag[] = notMatchingTags.concat(matchingTags);
  const toggleCommitExpansion = jest.fn();
  const props: IPastCommitNodeProps = {
    model: null,
    commit: {
      commit: '2414721b194453f058079d897d13c4e377f92dc6',
      author: 'author',
      date: 'date',
      commit_msg: 'message',
      pre_commits: ['pre_commit']
    },
    branches: branches,
    tagsList: tags,
    commands: null,
    trans,
    onCompareWithSelected: null,
    onSelectForCompare: null,
    expanded: false,
    toggleCommitExpansion,
    setRef: () => null
  };

  test('Includes commit info', () => {
    const node = shallow(<PastCommitNode {...props} />);
    expect(node.text()).toMatch(props.commit.author);
    expect(node.text()).toMatch(props.commit.commit.slice(0, 7));
    expect(node.text()).toMatch(props.commit.date);
    expect(node.text()).toMatch(props.commit.commit_msg);
  });

  test('Includes only relevant branch info', () => {
    const node = shallow(<PastCommitNode {...props} />);
    expect(node.text()).toMatch('name3');
    expect(node.text()).toMatch('name4');
    expect(node.text()).not.toMatch('name1');
    expect(node.text()).not.toMatch('name2');
  });

  test('Includes only relevant tag info', () => {
    const node = shallow(<PastCommitNode {...props} />);
    expect(node.text()).toMatch('1.0.0');
    expect(node.text()).toMatch('feature-1');
    expect(node.text()).not.toMatch('feature-2');
    expect(node.text()).not.toMatch('patch-007');
  });

  test('Toggle show details', () => {
    // simulates SinglePastCommitInfo child
    const node = shallow(
      <PastCommitNode {...props}>
        <div id="singlePastCommitInfo"></div>
      </PastCommitNode>
    );
    node.simulate('click');
    expect(toggleCommitExpansion).toBeCalledTimes(1);
    expect(toggleCommitExpansion).toHaveBeenCalledWith(props.commit.commit);
  });
});
